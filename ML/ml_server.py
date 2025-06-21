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
    # Ensure all material fields are present
    material_features = {
        "Material_Aluminum": 0, "Material_Silicon": 0, "Material_Plastic": 0,
        "Material_Glass": 0, "Material_Steel": 0, "Material_Organic": 0,
        "Material_Copper": 0, "Material_Insulation Foam": 0,
        "Material_Paper": 0, "Material_Cotton": 0
    }
    for k in material_features:
        material_features[k] = input_data.get(k, 0)
    # Merge input_data and material_features (material_features will overwrite if present)
    data = pd.DataFrame([{**input_data, **material_features}])
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

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8001)
