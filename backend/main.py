from fastapi import FastAPI, HTTPException, Depends, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from joblib import load
import pandas as pd
import os

app = FastAPI(title="MB Fitness API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load ML model
MODEL_PATH = os.path.join(os.path.dirname(__file__), "../model.pkl")
try:
    model = load(MODEL_PATH)
except Exception as e:
    print(f"Warning: Could not load model from {MODEL_PATH}: {e}")
    model = None

# Pydantic models
class WorkoutRequest(BaseModel):
    name: str
    description: str
    exercises: List[str]
    difficulty: str
    duration: int

class WorkoutUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    exercises: Optional[List[str]] = None
    difficulty: Optional[str] = None
    duration: Optional[int] = None

class AIRecommendationRequest(BaseModel):
    injury_type: str
    age: int
    fitness_level: str
    pain_level: int
    recovery_stage: str

class Exercise(BaseModel):
    id: str
    name: str
    description: str
    difficulty: str
    reps: str
    sets: str
    body_part: str
    injury_type: str
    duration: str

# In-memory storage (in production, use a real database)
workouts_db = {}
workout_id_counter = 1

# Predefined exercises database
EXERCISES_DB = [
    {
        "id": "ex1",
        "name": "Hip Flexor Stretch",
        "description": "Gentle hip flexor stretch to improve mobility",
        "difficulty": "Easy",
        "reps": "3x30s hold",
        "sets": "3",
        "body_part": "Hip",
        "injury_type": "ACL",
        "duration": "5 min"
    },
    {
        "id": "ex2",
        "name": "Ankle Circles",
        "description": "Circular ankle rotations for joint mobility",
        "difficulty": "Easy",
        "reps": "2x20 each",
        "sets": "2",
        "body_part": "Ankle",
        "injury_type": "ACL",
        "duration": "4 min"
    },
    {
        "id": "ex3",
        "name": "Clamshell Exercise",
        "description": "Hip abductor strengthening movement",
        "difficulty": "Medium",
        "reps": "3x15 each",
        "sets": "3",
        "body_part": "Hip/Glute",
        "injury_type": "ACL",
        "duration": "8 min"
    },
    {
        "id": "ex4",
        "name": "Single Leg Balance",
        "description": "Proprioception and balance training",
        "difficulty": "Medium",
        "reps": "3x30s each",
        "sets": "3",
        "body_part": "Leg",
        "injury_type": "ACL",
        "duration": "6 min"
    },
    {
        "id": "ex5",
        "name": "Seated Leg Raises",
        "description": "Quadriceps strengthening while seated",
        "difficulty": "Easy",
        "reps": "3x12",
        "sets": "3",
        "body_part": "Quad",
        "injury_type": "ACL",
        "duration": "7 min"
    },
    {
        "id": "ex6",
        "name": "Shoulder Pendulum",
        "description": "Gentle shoulder mobility and decompression",
        "difficulty": "Easy",
        "reps": "2x2min",
        "sets": "2",
        "body_part": "Shoulder",
        "injury_type": "Shoulder",
        "duration": "5 min"
    },
    {
        "id": "ex7",
        "name": "Glute Bridge",
        "description": "Posterior chain activation and strengthening",
        "difficulty": "Medium",
        "reps": "3x15",
        "sets": "3",
        "body_part": "Glute",
        "injury_type": "Back Pain",
        "duration": "10 min"
    },
    {
        "id": "ex8",
        "name": "Thoracic Rotation",
        "description": "Upper back mobility improvement",
        "difficulty": "Easy",
        "reps": "2x10 each",
        "sets": "2",
        "body_part": "Back",
        "injury_type": "Back Pain",
        "duration": "6 min"
    },
]

# Helper function to verify token (simplified - in production, verify with Supabase)
async def verify_token(authorization: Optional[str] = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Authorization header missing")
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid authorization format")
    token = authorization.replace("Bearer ", "")
    # In production, verify token with Supabase
    # For now, just check it's not empty
    if not token:
        raise HTTPException(status_code=401, detail="Invalid token")
    return token

@app.get("/")
async def root():
    return {"message": "MB Fitness API", "version": "1.0.0"}

@app.get("/health")
async def health():
    return {"status": "healthy"}

# AI Recommendation Endpoint
@app.post("/api/ai/recommend")
async def get_ai_recommendation(request: AIRecommendationRequest, token: str = Depends(verify_token)):
    try:
        if model:
            # Use ML model
            data = pd.DataFrame([{
                "injury": request.injury_type,
                "age": request.age,
                "fitness_level": request.fitness_level,
                "pain_level": request.pain_level,
                "recovery_stage": request.recovery_stage
            }])
            prediction = model.predict(data)[0]
            
            # Find matching exercises
            recommended_exercises = [
                ex for ex in EXERCISES_DB 
                if ex["injury_type"] == request.injury_type or ex["difficulty"].lower() == request.fitness_level.lower()
            ]
        else:
            # Fallback to logic-based recommendation
            recommended_exercises = [
                ex for ex in EXERCISES_DB 
                if ex["injury_type"] == request.injury_type
            ]
            prediction = "Custom workout based on injury type"
        
        return {
            "recommended_workout": prediction,
            "exercises": recommended_exercises[:5],
            "parameters": {
                "injury_type": request.injury_type,
                "age": request.age,
                "fitness_level": request.fitness_level,
                "pain_level": request.pain_level,
                "recovery_stage": request.recovery_stage
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating recommendation: {str(e)}")

# Workout CRUD Endpoints
@app.post("/api/workouts")
async def create_workout(workout: WorkoutRequest, token: str = Depends(verify_token)):
    global workout_id_counter
    workout_id = str(workout_id_counter)
    workout_id_counter += 1
    
    workouts_db[workout_id] = {
        "id": workout_id,
        "name": workout.name,
        "description": workout.description,
        "exercises": workout.exercises,
        "difficulty": workout.difficulty,
        "duration": workout.duration,
        "user_id": token  # Simplified - use actual user ID in production
    }
    
    return workouts_db[workout_id]

@app.get("/api/workouts")
async def get_workouts(token: str = Depends(verify_token)):
    # In production, filter by actual user ID
    return list(workouts_db.values())

@app.get("/api/workouts/{workout_id}")
async def get_workout(workout_id: str, token: str = Depends(verify_token)):
    if workout_id not in workouts_db:
        raise HTTPException(status_code=404, detail="Workout not found")
    return workouts_db[workout_id]

@app.put("/api/workouts/{workout_id}")
async def update_workout(workout_id: str, workout_update: WorkoutUpdate, token: str = Depends(verify_token)):
    if workout_id not in workouts_db:
        raise HTTPException(status_code=404, detail="Workout not found")
    
    workout = workouts_db[workout_id]
    
    if workout_update.name is not None:
        workout["name"] = workout_update.name
    if workout_update.description is not None:
        workout["description"] = workout_update.description
    if workout_update.exercises is not None:
        workout["exercises"] = workout_update.exercises
    if workout_update.difficulty is not None:
        workout["difficulty"] = workout_update.difficulty
    if workout_update.duration is not None:
        workout["duration"] = workout_update.duration
    
    return workout

@app.delete("/api/workouts/{workout_id}")
async def delete_workout(workout_id: str, token: str = Depends(verify_token)):
    if workout_id not in workouts_db:
        raise HTTPException(status_code=404, detail="Workout not found")
    
    deleted_workout = workouts_db.pop(workout_id)
    return {"message": "Workout deleted successfully", "deleted_workout": deleted_workout}

# Exercises Endpoint
@app.get("/api/exercises")
async def get_exercises(injury_type: Optional[str] = None, token: str = Depends(verify_token)):
    if injury_type:
        filtered = [ex for ex in EXERCISES_DB if ex["injury_type"] == injury_type]
        return filtered
    return EXERCISES_DB

@app.get("/api/exercises/{exercise_id}")
async def get_exercise(exercise_id: str, token: str = Depends(verify_token)):
    exercise = next((ex for ex in EXERCISES_DB if ex["id"] == exercise_id), None)
    if not exercise:
        raise HTTPException(status_code=404, detail="Exercise not found")
    return exercise

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
