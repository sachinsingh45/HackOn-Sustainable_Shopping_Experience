import requests
import json

def test_ml_server():
    """Test the ML server endpoints"""
    base_url = "https://ecoml.onrender.com"
    
    print("🧪 Testing ML Server...")
    
    # Test health endpoint
    try:
        health_response = requests.get(f"{base_url}/health")
        print(f"✅ Health check: {health_response.status_code}")
        if health_response.status_code == 200:
            health_data = health_response.json()
            print(f"   Model loaded: {health_data.get('model_loaded', 'Unknown')}")
            print(f"   Status: {health_data.get('status', 'Unknown')}")
        else:
            print(f"   Error: {health_response.text}")
    except Exception as e:
        print(f"❌ Health check failed: {e}")
        return
    
    # Test prediction endpoint with valid data
    test_payload = {
        "Weight (kg)": 1.5,
        "Distance (km)": 100,
        "Recyclable": 1,
        "Repairable": 1,
        "Lifespan (yrs)": 3,
        "Packaging Used": "Cardboard box",
        "Category": "Electronics",
        "Subcategory": "Smartphones",
        "Material_Plastic": 70,
        "Material_Aluminum": 20,
        "Material_Glass": 10,
        "Material_Silicon": 0,
        "Material_Steel": 0,
        "Material_Organic": 0,
        "Material_Copper": 0,
        "Material_Insulation Foam": 0,
        "Material_Paper": 0,
        "Material_Cotton": 0
    }
    
    try:
        predict_response = requests.post(f"{base_url}/predict", json=test_payload)
        print(f"✅ Prediction test: {predict_response.status_code}")
        if predict_response.status_code == 200:
            predict_data = predict_response.json()
            print(f"   Carbon Footprint: {predict_data.get('carbon_footprint')} kg")
            print(f"   Eco Score: {predict_data.get('eco_score')}")
            print(f"   Eco Friendly: {predict_data.get('isEcoFriendly')}")
            print(f"   Status: {predict_data.get('status', 'unknown')}")
            if predict_data.get('warning'):
                print(f"   Warning: {predict_data.get('warning')}")
        else:
            print(f"   Error: {predict_response.text}")
    except Exception as e:
        print(f"❌ Prediction test failed: {e}")
    
    # Test prediction endpoint with invalid data
    invalid_payload = {
        "Weight (kg)": "invalid",
        "Distance (km)": -50
    }
    
    try:
        invalid_response = requests.post(f"{base_url}/predict", json=invalid_payload)
        print(f"✅ Invalid data test: {invalid_response.status_code}")
        if invalid_response.status_code != 200:
            print(f"   Expected error: {invalid_response.text}")
        else:
            print("   ⚠️  Unexpected success with invalid data")
    except Exception as e:
        print(f"❌ Invalid data test failed: {e}")
    
    # Test prediction endpoint with missing required fields
    incomplete_payload = {
        "Weight (kg)": 1.5
        # Missing Distance (km)
    }
    
    try:
        incomplete_response = requests.post(f"{base_url}/predict", json=incomplete_payload)
        print(f"✅ Missing fields test: {incomplete_response.status_code}")
        if incomplete_response.status_code != 200:
            print(f"   Expected error: {incomplete_response.text}")
        else:
            print("   ⚠️  Unexpected success with missing fields")
    except Exception as e:
        print(f"❌ Missing fields test failed: {e}")

if __name__ == "__main__":
    test_ml_server() 