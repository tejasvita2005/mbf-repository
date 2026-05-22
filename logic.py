def get_exercises(injury):
    if injury == "ACL":
        return ["Squat", "Leg Raise", "Step Up"]
    
    elif injury == "Achilles":
        return ["Heel Raise", "Stretch", "Toe Walk"]
    
    elif injury == "Meniscus":
        return ["Hamstring Curl", "Wall Sit", "Leg Lift"]
    
    else:
        return ["Basic Stretch"]
    
print(get_exercises("ACL"))