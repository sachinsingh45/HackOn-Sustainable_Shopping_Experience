import requests
import json

# Test data
test_data = {
    "Weight (kg)": 1.5,
    "Distance (km)": 500,
    "Recyclable": 1,
    "Repairable": 0,
    "Lifespan (yrs)": 5,
    "Packaging Used": "Cardboard",
    "Category": "Electronics",
    "Subcategory": "Laptop",
    "Material_Aluminum": 60,
    "Material_Plastic": 30,
    "Material_Silicon": 10
}

try:
    response = requests.post(
        "http://127.0.0.1:8001/predict",
        json=test_data,
        headers={"Content-Type": "application/json"}
    )
    
    if response.status_code == 200:
        result = response.json()
        print("✅ ML API is working on port 8001!")
        print(f"Carbon Footprint: {result['carbon_footprint']} kg CO₂e")
        print(f"Eco Score: {result['eco_score']}")
        print(f"Eco Friendly: {result['isEcoFriendly']}")
    else:
        print(f"❌ ML API returned status code: {response.status_code}")
        print(f"Error: {response.text}")
        
except requests.exceptions.ConnectionError:
    print("❌ Could not connect to the ML server on port 8001. Make sure it's running.")
except Exception as e:
    print(f"❌ Error: {e}") 