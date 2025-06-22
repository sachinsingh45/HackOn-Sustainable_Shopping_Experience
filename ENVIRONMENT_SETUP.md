# Environment Variables Setup

## Frontend Environment Variables

Create a `.env` file in the `client` directory with the following content:

```env
# Backend API URL
SERVER_API_URL=https://hackon-sustainable-shopping-experience.onrender.com/api/

# WebSocket URL
VITE_SOCKET_URL=https://hackon-sustainable-shopping-experience.onrender.com

# AI API Keys
VITE_GEMINI_API_KEY=your_gemini_api_key_here
VITE_COHERE_API_KEY=didVFI5M7kCxfGTJ3mNeOq29lsIa2mxgFHOJABA2

# ML Server URLs
VITE_ML_SERVER_URL=http://127.0.0.1:8001
VITE_MATERIAL_ANALYSIS_URL=https://machine-learning-8crr.onrender.com
```

## Environment Variables Explained

### SERVER_API_URL
- **Purpose**: Base URL for all API calls to your main backend
- **Development**: `http://localhost:8000/api/`
- **Production**: `https://hackon-sustainable-shopping-experience.onrender.com/api/`

### VITE_SOCKET_URL
- **Purpose**: Base URL for WebSocket connections
- **Development**: `http://localhost:8000`
- **Production**: `https://hackon-sustainable-shopping-experience.onrender.com`

### VITE_GEMINI_API_KEY
- **Purpose**: API key for Google's Gemini AI service
- **Usage**: Used for AI-powered features in the frontend
- **Get it from**: [Google AI Studio](https://makersuite.google.com/app/apikey)

### VITE_COHERE_API_KEY
- **Purpose**: API key for Cohere AI service
- **Usage**: Used for AI chat and text generation features
- **Get it from**: [Cohere Console](https://console.cohere.ai/)

### VITE_ML_SERVER_URL
- **Purpose**: URL for the ML prediction server
- **Development**: `http://127.0.0.1:8001`
- **Production**: Update to your hosted ML server URL

### VITE_MATERIAL_ANALYSIS_URL
- **Purpose**: URL for material analysis service
- **Current**: `https://machine-learning-8crr.onrender.com`
- **Usage**: Used for analyzing product materials and sustainability

## Different Environments

### Development
```env
SERVER_API_URL=http://localhost:8000/api/
VITE_SOCKET_URL=http://localhost:8000
VITE_GEMINI_API_KEY=your_gemini_api_key_here
VITE_COHERE_API_KEY=didVFI5M7kCxfGTJ3mNeOq29lsIa2mxgFHOJABA2
VITE_ML_SERVER_URL=http://127.0.0.1:8001
VITE_MATERIAL_ANALYSIS_URL=https://machine-learning-8crr.onrender.com
```

### Production (Your Current Setup)
```env
SERVER_API_URL=https://hackon-sustainable-shopping-experience.onrender.com/api/
VITE_SOCKET_URL=https://hackon-sustainable-shopping-experience.onrender.com
VITE_GEMINI_API_KEY=your_gemini_api_key_here
VITE_COHERE_API_KEY=didVFI5M7kCxfGTJ3mNeOq29lsIa2mxgFHOJABA2
VITE_ML_SERVER_URL=http://127.0.0.1:8001
VITE_MATERIAL_ANALYSIS_URL=https://machine-learning-8crr.onrender.com
```

## Important Notes

### API URL Format
- **Make sure to include `/api/` at the end** of `SERVER_API_URL`
- This ensures all API calls are properly routed to your backend endpoints

### Backend Environment Variables
For your backend (server), you'll need these environment variables:
```env
NODE_ENV=production
PORT=8000
MONGODB_URI=your_mongodb_connection_string
COHERE_API_KEY=didVFI5M7kCxfGTJ3mNeOq29lsIa2mxgFHOJABA2
JWT_SECRET=your_jwt_secret
```

### Security
- **Never commit your `.env` file** to version control
- **Use different API keys** for development and production
- **Rotate your API keys** regularly for security

## Deployment Platforms

### Vercel
1. Go to your project settings
2. Navigate to "Environment Variables"
3. Add the variables:
   - `SERVER_API_URL`
   - `VITE_SOCKET_URL`
   - `VITE_GEMINI_API_KEY`
   - `VITE_COHERE_API_KEY`
   - `VITE_ML_SERVER_URL`
   - `VITE_MATERIAL_ANALYSIS_URL`

### Netlify
1. Go to Site settings > Environment variables
2. Add the variables:
   - `SERVER_API_URL`
   - `VITE_SOCKET_URL`
   - `VITE_GEMINI_API_KEY`
   - `VITE_COHERE_API_KEY`
   - `VITE_ML_SERVER_URL`
   - `VITE_MATERIAL_ANALYSIS_URL`

### Render (Backend)
1. Go to your service settings
2. Navigate to "Environment"
3. Add the variables:
   - `NODE_ENV=production`
   - `PORT=8000`
   - `MONGODB_URI`
   - `COHERE_API_KEY`
   - `JWT_SECRET`

## Files Updated

The following files now use environment variables:

1. **`client/src/services/api.ts`** - Uses `SERVER_API_URL` for all API calls
2. **`client/src/services/socket.ts`** - Uses `VITE_SOCKET_URL` for WebSocket connections
3. **`client/src/pages/SellOnAmazonPage.tsx`** - Uses `VITE_ML_SERVER_URL` for ML predictions
4. **`client/src/pages/CarbonCalculatorPage.tsx`** - Uses `VITE_ML_SERVER_URL` for ML predictions
5. **`client/src/components/common/biodegradable.tsx`** - Uses `VITE_MATERIAL_ANALYSIS_URL` for material analysis
6. **`client/src/pages/SellerDashboardPage.tsx`** - Updated to use API service
7. **`client/src/components/layout/Header.tsx`** - Fixed split error

## Testing Environment Variables

You can test if environment variables are loaded correctly by adding this to any component:

```typescript
console.log('Server API URL:', import.meta.env.SERVER_API_URL);
console.log('Socket URL:', import.meta.env.VITE_SOCKET_URL);
console.log('ML Server URL:', import.meta.env.VITE_ML_SERVER_URL);
console.log('Material Analysis URL:', import.meta.env.VITE_MATERIAL_ANALYSIS_URL);
console.log('Gemini API Key:', import.meta.env.VITE_GEMINI_API_KEY ? 'Set' : 'Not set');
console.log('Cohere API Key:', import.meta.env.VITE_COHERE_API_KEY ? 'Set' : 'Not set');
```

## Troubleshooting

### Common Issues

1. **Environment variable not working**
   - Make sure the `.env` file is in the `client` directory
   - Restart your development server after adding environment variables
   - Check that variable names start with `VITE_` (except `SERVER_API_URL`)

2. **API calls failing**
   - Verify `SERVER_API_URL` ends with `/api/`
   - Check that your backend is running on Render
   - Ensure the API endpoints exist

3. **WebSocket connection failed**
   - Verify `VITE_SOCKET_URL` is correct
   - Check that your backend supports WebSocket connections
   - Ensure CORS is properly configured on the backend

4. **ML predictions failing**
   - Verify `VITE_ML_SERVER_URL` is correct
   - Check that your ML server is running
   - Ensure the ML server endpoints exist

5. **Material analysis failing**
   - Verify `VITE_MATERIAL_ANALYSIS_URL` is correct
   - Check that the material analysis service is accessible

6. **AI features not working**
   - Verify `VITE_GEMINI_API_KEY` and `VITE_COHERE_API_KEY` are set
   - Check that the API keys are valid and have proper permissions 