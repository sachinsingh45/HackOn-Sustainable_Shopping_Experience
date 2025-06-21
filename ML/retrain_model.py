import pandas as pd
import joblib
import re
from collections import defaultdict
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
import numpy as np

# Load dataset
print("Loading dataset...")
df = pd.read_csv("realistic_eco_dataset_1000.csv")

# Extract materials
def extract_material_percentages(material_string):
    material_dict = defaultdict(float)
    for part in str(material_string).split(","):
        match = re.match(r"([\w\s]+)\s+(\d+\.?\d*)%", part.strip())
        if match:
            material = match.group(1).strip()
            percent = float(match.group(2))
            material_dict[material] += percent
    return material_dict

# Top 10 materials
print("Processing materials...")
all_materials = []
for row in df["Material Composition"]:
    all_materials.extend(extract_material_percentages(row).keys())

top_materials = pd.Series(all_materials).value_counts().nlargest(10).index.tolist()

# Add material features
for mat in top_materials:
    df[f"Material_{mat}"] = df["Material Composition"].apply(
        lambda x: extract_material_percentages(x).get(mat, 0)
    )

# Convert to numeric
df["Recyclable"] = df["Recyclable"].map({"Yes": 1, "No": 0})
df["Repairable"] = df["Repairable"].map({"Yes": 1, "No": 0})

# Features & targets
numeric_features = [
    "Weight (kg)", "Distance (km)", "Recyclable", "Repairable", "Lifespan (yrs)"
] + [f"Material_{m}" for m in top_materials]

categorical_features = ["Category", "Subcategory", "Packaging Used"]

target = ["Carbon Footprint (kg CO2e)", "Eco Score"]

X = df[numeric_features + categorical_features]
y = df[target]

# Split the data
print("Splitting data...")
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Create preprocessing pipeline
print("Creating preprocessing pipeline...")
numeric_transformer = Pipeline(steps=[
    ('scaler', StandardScaler())
])

categorical_transformer = Pipeline(steps=[
    ('onehot', OneHotEncoder(handle_unknown='ignore'))
])

preprocessor = ColumnTransformer(
    transformers=[
        ('num', numeric_transformer, numeric_features),
        ('cat', categorical_transformer, categorical_features)
    ])

# Create and train model
print("Training model...")
model = Pipeline(steps=[
    ('preprocessor', preprocessor),
    ('regressor', RandomForestRegressor(n_estimators=100, random_state=42))
])

model.fit(X_train, y_train)

# Save the model
print("Saving model...")
joblib.dump(model, "eco_model.pkl")

# Predict
print("Making predictions...")
y_pred = model.predict(X_test)

# Evaluate
y_true_cf = y_test["Carbon Footprint (kg CO2e)"]
y_pred_cf = y_pred[:, 0]

y_true_eco = y_test["Eco Score"]
y_pred_eco = y_pred[:, 1]

print("\n🌍 Carbon Footprint:")
print("MAE:", round(mean_absolute_error(y_true_cf, y_pred_cf), 2))
print("MSE:", round(mean_squared_error(y_true_cf, y_pred_cf), 2))
print("R² Score:", round(r2_score(y_true_cf, y_pred_cf), 2))

print("\n🌱 Eco Score:")
print("MAE:", round(mean_absolute_error(y_true_eco, y_pred_eco), 3))
print("MSE:", round(mean_squared_error(y_true_eco, y_pred_eco), 3))
print("R² Score:", round(r2_score(y_true_eco, y_pred_eco), 3))

print("\n✅ Model retrained and saved successfully!") 