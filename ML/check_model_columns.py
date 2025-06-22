#!/usr/bin/env python3
"""
Check ML Model Columns
This script checks what columns the ML model expects.
"""

import joblib
import pandas as pd

def check_model_columns():
    """Check what columns the ML model expects"""
    print("🔍 Checking ML Model Columns...")
    
    try:
        # Load the model
        model = joblib.load("eco_model.pkl")
        print("✅ Model loaded successfully")
        
        # Check if it's a pipeline
        if hasattr(model, 'steps'):
            print(f"📊 Model is a Pipeline with {len(model.steps)} steps")
            
            # Check the preprocessing step (usually the first step)
            if len(model.steps) > 0:
                preprocessor = model.steps[0][1]
                print(f"🔧 Preprocessor: {type(preprocessor).__name__}")
                
                # Try to get feature names
                if hasattr(preprocessor, 'get_feature_names_out'):
                    feature_names = preprocessor.get_feature_names_out()
                    print(f"📋 Expected features ({len(feature_names)}):")
                    for i, name in enumerate(feature_names):
                        print(f"   {i+1:2d}. {name}")
                elif hasattr(preprocessor, 'feature_names_in_'):
                    feature_names = preprocessor.feature_names_in_
                    print(f"📋 Expected features ({len(feature_names)}):")
                    for i, name in enumerate(feature_names):
                        print(f"   {i+1:2d}. {name}")
                else:
                    print("⚠️ Could not determine expected features")
        
        # Also check the dataset to see what materials were used
        print("\n📊 Checking dataset materials...")
        df = pd.read_csv("realistic_eco_dataset_1000.csv")
        
        # Extract materials from the dataset
        all_materials = []
        for row in df["Material Composition"]:
            for part in str(row).split(","):
                if "%" in part:
                    material = part.split("%")[0].strip().split()[-1]  # Get last word before %
                    all_materials.append(material)
        
        # Get top materials
        from collections import Counter
        material_counts = Counter(all_materials)
        top_materials = [mat for mat, count in material_counts.most_common(10)]
        
        print(f"📋 Top materials from dataset:")
        for i, material in enumerate(top_materials):
            print(f"   {i+1:2d}. {material}")
        
        # Create the expected feature names
        expected_features = [
            "Weight (kg)", "Distance (km)", "Recyclable", "Repairable", "Lifespan (yrs)",
            "Packaging Used", "Category", "Subcategory"
        ] + [f"Material_{m}" for m in top_materials]
        
        print(f"\n📋 Expected features ({len(expected_features)}):")
        for i, feature in enumerate(expected_features):
            print(f"   {i+1:2d}. {feature}")
        
        return expected_features
        
    except Exception as e:
        print(f"❌ Error checking model columns: {e}")
        import traceback
        print(f"📋 Traceback: {traceback.format_exc()}")
        return None

if __name__ == "__main__":
    check_model_columns() 