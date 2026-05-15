from joblib import load
import pandas as pd

# Load the trained model
model = load("ai/model.pkl")

def predict_exercise(injury, age, fitness_level, pain_level, recovery_stage):
    # Prepare input data
    data = pd.DataFrame([{
        "injury": injury,
        "age": age,
        "fitness_level": fitness_level,
        "pain_level": pain_level,
        "recovery_stage": recovery_stage
    }])

    # Predict recommended exercise
    prediction = model.predict(data)[0]
    return prediction


# Test the model
if __name__ == "__main__":
    result = predict_exercise(
        "ACL",
        22,
        "Beginner",
        5,
        "Early"
    )

    print("Recommended Exercise:", result)gi