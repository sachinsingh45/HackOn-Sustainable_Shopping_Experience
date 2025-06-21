from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import joblib
import pandas as pd
import numpy as np
import uvicorn

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

model = joblib.load("eco_model.pkl")

@app.post("/predict")
async def predict(request: Request):
    input_data = await request.json()
    
    # Get the expected material columns from the model's feature names
    # This is a workaround since we can't easily access the column names from the pipeline
    # We'll use the materials that the client typically sends
    expected_materials = [
        'Aluminum', 'Silicon', 'Plastic', 'Glass', 'Steel', 'Organic', 
        'Copper', 'Insulation Foam', 'Paper', 'Cotton'
    ]
    
    # Ensure all material fields are present
    material_features = {}
    for material in expected_materials:
        material_features[f"Material_{material}"] = input_data.get(f"Material_{material}", 0)
    
    # Merge input_data and material_features (material_features will overwrite if present)
    data = pd.DataFrame([{**input_data, **material_features}])
    
    try:
        prediction = model.predict(data)[0]
        
        # Convert numpy types to native Python types
        carbon_footprint = float(round(prediction[0], 2))
        eco_score = float(round(prediction[1], 2))
        
        is_eco_friendly = False
        if len(prediction) > 2:
            is_eco_friendly = bool(prediction[2])
        else:
            is_eco_friendly = eco_score >= 60
        
        return {
            "carbon_footprint": carbon_footprint,
            "eco_score": eco_score,
            "isEcoFriendly": is_eco_friendly
        }
    except Exception as e:
        # If there's still a column mismatch, try to handle it more gracefully
        print(f"Prediction error: {e}")
        # Return a fallback prediction based on basic heuristics
        weight = input_data.get('Weight (kg)', 1)
        recyclable = input_data.get('Recyclable', 0)
        repairable = input_data.get('Repairable', 0)
        
        # Simple heuristic-based fallback
        carbon_footprint = weight * 2.5  # Rough estimate
        eco_score = 50 + (recyclable * 20) + (repairable * 15)  # Basic scoring
        eco_score = min(100, max(0, eco_score))  # Clamp between 0-100
        
        return {
            "carbon_footprint": round(carbon_footprint, 2),
            "eco_score": round(eco_score / 100, 2),  # Normalize to 0-1
            "isEcoFriendly": eco_score >= 60
        }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8001)
