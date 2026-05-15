import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder
from sklearn.pipeline import Pipeline
from sklearn.neural_network import MLPClassifier
from joblib import dump

# Load dataset
df = pd.read_csv("ai/data.csv")

# Input features
X = df[["injury", "age", "fitness_level", "pain_level", "recovery_stage"]]

# Target output
y = df["recommended_exercise"]

# Convert text columns into numbers
preprocessor = ColumnTransformer(
    transformers=[
        (
            "cat",
            OneHotEncoder(handle_unknown="ignore"),
            ["injury", "fitness_level", "recovery_stage"]
        )
    ],
    remainder="passthrough"
)

# Artificial Neural Network model
model = Pipeline([
    ("preprocessor", preprocessor),
    ("classifier", MLPClassifier(
        hidden_layer_sizes=(16, 8),
        max_iter=1000,
        random_state=42
    ))
])

# Train the model
model.fit(X, y)

# Save the trained model
dump(model, "ai/model.pkl")

print("Model trained successfully!")