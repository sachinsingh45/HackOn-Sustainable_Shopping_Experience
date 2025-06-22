# Deployment Guide

## Current Issue Fixed

The deployment was failing due to Express 5.1.0 compatibility issues with route parameters. This has been resolved by:

1. **Downgraded Express** from 5.1.0 to 4.18.2 in `server/package.json`
2. **Updated CORS configuration** to be more flexible in production
3. **Fixed static file serving** paths to point to the correct client directory

## Deployment Steps

### For Render.com

1. **Environment Variables**: Make sure to set these in your Render dashboard:
   ```
   NODE_ENV=production
   PORT=8000
   MONGODB_URI=your_mongodb_connection_string
   COHERE_API_KEY=your_cohere_api_key
   JWT_SECRET=your_jwt_secret
   ```

2. **Build Command**: Use `npm install` (this will automatically run the build script)

3. **Start Command**: Use `npm start`

### For Other Platforms

1. **Install dependencies**:
   ```bash
   cd server
   npm install
   ```

2. **Build the client**:
   ```bash
   cd ../client
   npm install
   npm run build
   ```

3. **Start the server**:
   ```bash
   cd ../server
   npm start
   ```

## Key Changes Made

### 1. Express Version Downgrade
- Changed from `express: ^5.1.0` to `express: ^4.18.2`
- This fixes the "Missing parameter name" error from path-to-regexp

### 2. CORS Configuration
- Made CORS more flexible in production
- Allows all origins in production for easier deployment
- Maintains security in development

### 3. Static File Serving
- Fixed paths to serve from `client/dist` instead of `frontend/build`
- Updated to use correct directory structure

### 4. Build Scripts
- Added build script to automatically build the client
- Added postinstall script for automatic builds

## Troubleshooting

If you still encounter issues:

1. **Check environment variables** are properly set
2. **Verify MongoDB connection** string is correct
3. **Ensure all dependencies** are installed
4. **Check logs** for any remaining errors

## Next Steps

After successful deployment:

1. Update the CORS allowed origins with your actual frontend domain
2. Set up proper environment variables for production
3. Configure your database for production use
4. Set up monitoring and logging 