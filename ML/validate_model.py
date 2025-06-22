#!/usr/bin/env python3
"""
ML Model Validation Script
This script validates the ML model and tests it with sample data.
"""

import joblib
import pandas as pd
import numpy as np

def validate_model():
    """Validate the ML model"""
    print("🔍 Validating ML Model...")
    
    try:
        # Load the model
        print("📦 Loading model...")
        model = joblib.load("eco_model.pkl")
        print("✅ Model loaded successfully")
        
        # Check model type and attributes
        print(f"📊 Model type: {type(model).__name__}")
        
        # Create test data that matches the expected format
        test_data = {
            "Weight (kg)": 1.5,
            "Distance (km)": 100,
            "Recyclable": 1,
            "Repairable": 1,
            "Lifespan (yrs)": 3,
            "Packaging Used": "Cardboard box",
            "Category": "Electronics",
            "Subcategory": "Smartphones",
            "Material_Aluminum": 0,
            "Material_Silicon": 0,
            "Material_Plastic": 70,
            "Material_Glass": 10,
            "Material_Steel": 0,
            "Material_Organic": 0,
            "Material_Copper": 0,
            "Material_Insulation Foam": 0,
            "Material_Paper": 0,
            "Material_Cotton": 0
        }
        
        print("🧪 Testing with sample data...")
        print(f"📋 Test data: {test_data}")
        
        # Convert to DataFrame
        df = pd.DataFrame([test_data])
        print(f"📊 DataFrame shape: {df.shape}")
        print(f"📋 DataFrame columns: {list(df.columns)}")
        print(f"🔢 DataFrame dtypes:\n{df.dtypes}")
        
        # Make prediction
        print("🎯 Making prediction...")
        prediction = model.predict(df)
        print(f"✅ Prediction successful!")
        print(f"📊 Raw prediction: {prediction}")
        print(f"📊 Prediction shape: {prediction.shape}")
        print(f"📊 Prediction type: {type(prediction)}")
        
        if len(prediction) > 0:
            pred = prediction[0]
            print(f"📊 First prediction: {pred}")
            print(f"📊 Prediction length: {len(pred)}")
            
            if len(pred) >= 2:
                carbon_footprint = float(round(pred[0], 2))
                eco_score = float(round(pred[1], 2))
                print(f"🌍 Carbon Footprint: {carbon_footprint} kg")
                print(f"🌱 Eco Score: {eco_score}")
                
                if len(pred) > 2:
                    is_eco_friendly = bool(pred[2])
                    print(f"♻️ Eco Friendly: {is_eco_friendly}")
                else:
                    is_eco_friendly = eco_score >= 60
                    print(f"♻️ Eco Friendly (calculated): {is_eco_friendly}")
            else:
                print("⚠️ Prediction has fewer than 2 values")
        else:
            print("⚠️ No predictions returned")
        
        # Test with different data variations
        print("\n🧪 Testing with different data variations...")
        
        # Test 1: Minimal data
        minimal_data = {
            "Weight (kg)": 1.0,
            "Distance (km)": 50,
            "Recyclable": 0,
            "Repairable": 0,
            "Lifespan (yrs)": 1,
            "Packaging Used": "Plastic bag",
            "Category": "General",
            "Subcategory": "",
            "Material_Aluminum": 0,
            "Material_Silicon": 0,
            "Material_Plastic": 100,
            "Material_Glass": 0,
            "Material_Steel": 0,
            "Material_Organic": 0,
            "Material_Copper": 0,
            "Material_Insulation Foam": 0,
            "Material_Paper": 0,
            "Material_Cotton": 0
        }
        
        df_minimal = pd.DataFrame([minimal_data])
        pred_minimal = model.predict(df_minimal)[0]
        print(f"📊 Minimal data prediction: {pred_minimal}")
        
        # Test 2: Organic product
        organic_data = {
            "Weight (kg)": 0.5,
            "Distance (km)": 25,
            "Recyclable": 1,
            "Repairable": 1,
            "Lifespan (yrs)": 5,
            "Packaging Used": "Paper bag",
            "Category": "Grocery",
            "Subcategory": "Organic Foods",
            "Material_Aluminum": 0,
            "Material_Silicon": 0,
            "Material_Plastic": 0,
            "Material_Glass": 0,
            "Material_Steel": 0,
            "Material_Organic": 100,
            "Material_Copper": 0,
            "Material_Insulation Foam": 0,
            "Material_Paper": 0,
            "Material_Cotton": 0
        }
        
        df_organic = pd.DataFrame([organic_data])
        pred_organic = model.predict(df_organic)[0]
        print(f"📊 Organic data prediction: {pred_organic}")
        
        print("\n✅ Model validation completed successfully!")
        
    except Exception as e:
        print(f"❌ Model validation failed: {e}")
        import traceback
        print(f"📋 Traceback: {traceback.format_exc()}")

if __name__ == "__main__":
    validate_model() 