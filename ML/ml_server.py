from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import joblib
import pandas as pd
import numpy as np
import uvicorn
import logging
import traceback

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Eco ML Server", version="1.0.0")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global variable for model
model = None

def load_model():
    """Load the ML model with error handling"""
    global model
    try:
        model = joblib.load("eco_model.pkl")
        logger.info("Model loaded successfully")
        return True
    except FileNotFoundError:
        logger.error("Model file 'eco_model.pkl' not found")
        return False
    except Exception as e:
        logger.error(f"Error loading model: {str(e)}")
        return False

# Load model on startup
@app.on_event("startup")
async def startup_event():
    if not load_model():
        logger.error("Failed to load model on startup")

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "model_loaded": model is not None,
        "message": "Eco ML Server is running"
    }

@app.post("/predict")
async def predict(request: Request):
    """Predict carbon footprint and eco score"""
    try:
        # Check if model is loaded
        if model is None:
            logger.error("Model not loaded")
            raise HTTPException(
                status_code=503, 
                detail="ML model is not available. Please try again later."
            )
        
        # Parse input data
        try:
            input_data = await request.json()
            logger.info(f"Received input data: {input_data}")
        except Exception as e:
            logger.error(f"Error parsing JSON: {str(e)}")
            raise HTTPException(
                status_code=400, 
                detail="Invalid JSON data provided"
            )
        
        # Validate required fields
        required_fields = ['Weight (kg)', 'Distance (km)']
        missing_fields = [field for field in required_fields if field not in input_data]
        if missing_fields:
            raise HTTPException(
                status_code=400,
                detail=f"Missing required fields: {', '.join(missing_fields)}"
            )
        
        # Get the expected material columns from the model's feature names
        expected_materials = [
            'Plastic', 'Aluminum', 'Steel', 'Copper', 'Silicon', 'Organic', 
            'Glass', 'Insulation Foam', 'Drum Metal'
        ]
        
        # Ensure all material fields are present
        material_features = {}
        for material in expected_materials:
            material_features[f"Material_{material}"] = input_data.get(f"Material_{material}", 0)
        
        # Merge input_data and material_features (material_features will overwrite if present)
        data = pd.DataFrame([{**input_data, **material_features}])
        
        logger.info(f"Prepared data for prediction: {data.to_dict('records')[0]}")
        
        try:
            # Make prediction
            prediction = model.predict(data)[0]
            logger.info(f"Raw prediction: {prediction}")
            
            # Convert numpy types to native Python types
            carbon_footprint = float(round(prediction[0], 2))
            eco_score = float(round(prediction[1], 2))
            
            is_eco_friendly = False
            if len(prediction) > 2:
                is_eco_friendly = bool(prediction[2])
            else:
                is_eco_friendly = eco_score >= 60
            
            result = {
                "carbon_footprint": carbon_footprint,
                "eco_score": eco_score,
                "isEcoFriendly": is_eco_friendly,
                "status": "success"
            }
            
            logger.info(f"Prediction successful: {result}")
            return result
            
        except Exception as e:
            logger.error(f"Model prediction error: {str(e)}")
            logger.error(f"Error type: {type(e).__name__}")
            logger.error(f"Data shape: {data.shape if hasattr(data, 'shape') else 'No shape'}")
            logger.error(f"Data columns: {list(data.columns) if hasattr(data, 'columns') else 'No columns'}")
            logger.error(f"Data types: {data.dtypes if hasattr(data, 'dtypes') else 'No dtypes'}")
            logger.error(f"Traceback: {traceback.format_exc()}")
            
            # Return fallback prediction with warning
            weight = input_data.get('Weight (kg)', 1)
            recyclable = input_data.get('Recyclable', 0)
            repairable = input_data.get('Repairable', 0)
            
            # Simple heuristic-based fallback
            carbon_footprint = weight * 2.5  # Rough estimate
            eco_score = 50 + (recyclable * 20) + (repairable * 15)  # Basic scoring
            eco_score = min(100, max(0, eco_score))  # Clamp between 0-100
            
            fallback_result = {
                "carbon_footprint": round(carbon_footprint, 2),
                "eco_score": round(eco_score / 100, 2),  # Normalize to 0-1
                "isEcoFriendly": eco_score >= 60,
                "status": "fallback",
                "warning": f"ML model failed: {str(e)}"
            }
            
            logger.warning(f"Using fallback prediction: {fallback_result}")
            return fallback_result
            
    except HTTPException:
        # Re-raise HTTP exceptions
        raise
    except Exception as e:
        logger.error(f"Unexpected error in predict endpoint: {str(e)}")
        logger.error(f"Traceback: {traceback.format_exc()}")
        raise HTTPException(
            status_code=500,
            detail="Internal server error. Please try again later."
        )

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Global exception handler"""
    logger.error(f"Global exception handler caught: {str(exc)}")
    logger.error(f"Traceback: {traceback.format_exc()}")
    return JSONResponse(
        status_code=500,
        content={
            "detail": "Internal server error. Please try again later.",
            "error": str(exc)
        }
    )

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8001)
