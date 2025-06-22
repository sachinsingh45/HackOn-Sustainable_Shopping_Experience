#!/usr/bin/env python3
"""
ML Server Startup Script
This script checks dependencies and starts the ML server with proper error handling.
"""

import subprocess
import sys
import os
import time
import requests

def check_dependencies():
    """Check if required packages are installed"""
    required_packages = [
        'fastapi',
        'uvicorn',
        'joblib',
        'pandas',
        'scikit-learn',
        'numpy'
    ]
    
    missing_packages = []
    
    for package in required_packages:
        try:
            __import__(package.replace('-', '_'))
        except ImportError:
            missing_packages.append(package)
    
    if missing_packages:
        print(f"❌ Missing required packages: {', '.join(missing_packages)}")
        print("Please install them using: pip install -r requirements.txt")
        return False
    
    print("✅ All required packages are installed")
    return True

def check_model_file():
    """Check if the ML model file exists"""
    model_file = "eco_model.pkl"
    
    if not os.path.exists(model_file):
        print(f"❌ Model file '{model_file}' not found")
        print("Please ensure the model file is in the ML directory")
        return False
    
    file_size = os.path.getsize(model_file) / (1024 * 1024)  # Size in MB
    print(f"✅ Model file found ({file_size:.1f} MB)")
    return True

def test_server_health():
    """Test if the server is responding"""
    try:
        response = requests.get("http://127.0.0.1:8001/health", timeout=5)
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Server is running and healthy")
            print(f"   Model loaded: {data.get('model_loaded', 'Unknown')}")
            return True
        else:
            print(f"❌ Server responded with status {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print("❌ Cannot connect to server on port 8001")
        return False
    except Exception as e:
        print(f"❌ Health check failed: {e}")
        return False

def start_server():
    """Start the ML server"""
    print("🚀 Starting ML Server...")
    
    try:
        # Start the server using uvicorn
        process = subprocess.Popen([
            sys.executable, "-m", "uvicorn", 
            "ml_server:app", 
            "--host", "0.0.0.0", 
            "--port", "8001",
            "--reload"
        ], cwd=os.path.dirname(os.path.abspath(__file__)))
        
        print("⏳ Waiting for server to start...")
        time.sleep(3)  # Wait for server to start
        
        # Test if server is running
        if test_server_health():
            print("🎉 ML Server is running successfully!")
            print("   URL: http://127.0.0.1:8001")
            print("   Health check: http://127.0.0.1:8001/health")
            print("   API docs: http://127.0.0.1:8001/docs")
            print("\nPress Ctrl+C to stop the server")
            
            try:
                process.wait()  # Wait for the process to finish
            except KeyboardInterrupt:
                print("\n🛑 Stopping server...")
                process.terminate()
                process.wait()
                print("✅ Server stopped")
        else:
            print("❌ Server failed to start properly")
            process.terminate()
            return False
            
    except Exception as e:
        print(f"❌ Failed to start server: {e}")
        return False
    
    return True

def main():
    """Main function"""
    print("🔧 ML Server Setup and Startup")
    print("=" * 40)
    
    # Check dependencies
    if not check_dependencies():
        sys.exit(1)
    
    # Check model file
    if not check_model_file():
        sys.exit(1)
    
    # Check if server is already running
    if test_server_health():
        print("✅ Server is already running!")
        return
    
    # Start server
    if not start_server():
        sys.exit(1)

if __name__ == "__main__":
    main() 