# HackOn With Amazon - Season 5
 
## Theme: Sustainable Shopping Experience

### Team Name: Lazy_Coders
### Team Members:
- Sachin Singh
- Shashi Prakash
- Alakh Mathur
- Tushar Srivastava

---

## Overview of our Solution:

Our next-generation e-commerce platform integrates seamlessly with Amazon to empower intelligent, sustainable shopping decisions. We've built a comprehensive solution that combines convenience with environmental consciousness through four key features:

- **🔍 Green Lens** - Analyze environmental impact and sustainability metrics of products in real-time
- **🛒 Green Store** - Discover curated eco-friendly alternatives with verified sustainability credentials
- **🤝 Green Partner** - Smart shopping companion, transforms your cart analysis into actionable eco-swaps, personalized challenges, and live carbon tracking
- **💰 Group Buy** - Save money and reduce environmental impact through collective purchasing power
- **🎮 Eco Challenges** - Gamified experiences that motivate customers to adopt eco-friendly shopping habits
- **📊 Green Bridge** - Sellers unlock sustainability analytics, dive into environmental impact with insights on packaging waste, emissions, and recyclability metrics

Our platform bridges the gap between online shopping convenience and sustainability analytics, providing both buyers and sellers with powerful tools to reduce their carbon footprint while making smarter purchasing decisions.


---

## 🛒 Key Features:

### For the Customers:

- **Green Store:** Browse a curated selection of eco-friendly products, filter by eco features (biodegradable, recycled, carbon neutral, etc.), and see transparent sustainability metrics.
- **Green Lens:** Enter the product details and view the environmental impact of any product.
- **Green Partner AI:** Analyze your cart and show eco-friendly alternatives, eco-challenges and your carbon footprint.
- **Group Buy:** Team up with others to buy in bulk, save up to 40%, and reduce packaging waste.
- **Eco Challenges:** Take on fun, rewarding challenges (e.g., "Buy 1 eco-friendly product today", "Save 5kg CO₂ this week") and earn digital badges.
- **Order History & Impact:** Track your past orders, see your cumulative CO₂ savings, and monitor your progress over time.
- **Profile Dashboard:** View your eco-score, carbon saved, money saved, badges earned and challenge progress.

### For Sellers

- **GreenBridge Dashboard:** 
  - **GreenScore Analytics:** Get insights on packaging waste, return rates, CO₂ emissions, and recyclability for each product.
  - **Climate Pledge Friendly:** Access checklists and nudges to earn green certifications and boost product visibility.
  - **Seller Community:** Share best practices, success stories, and connect with other sustainable sellers.

---

## Tech Stack

- **Frontend:**
  - **Core Framework:** React, TypeScript, Vite, React Router DOM, Zustand
  - **UI & Styling:** Tailwind CSS, Framer Motion, Lucide React, React icons, React avatar
  - **Data Visualization:** Recharts
  - **Real-time communication:** Socket.io client
  - **HTTP client:** Axios
- **Backend:**
  - **Core Framework:** Node.js, Express.js, MongoDB, Mongoose
  - **Authentication & Security:** bcryptjs, jsonwebtoken, express-validator
  - **Real-Time Communication:** Socket.io
  - **Middleware & Utilities:** CORS, cookie-parser, body-parser, validator
  - **Environment & COnfiguration:** Dotenv
- **AI/ML:**
  - **ML Libraries:** Scikit-learn, Pandas, Joblib
  - FastAPI
  - Uvicorn
  - Cohere API
- **Deployment & Hosting:**
  - **Backend Hosting:** Render
  - **Frontend Hosting:** Vercel
---


## 📝 Getting Started

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/your-repo/HackOn-Sustainable_Shopping_Experience.git
   ```
2. **Install the dependencies:**
   - Backend:
     ```bash
     cd server
     ```
     ```bash
     npm install
     ```
    - Model:
      ```bash
       cd ML
      ```
      ```bash
       pip install -r requirements.txt
      ```
    - Frontend:
      ```bash
       cd client
      ```
      ```bash
       npm install
      ```
3. **Configure the Environment Variables:**
   - Backend:

     Create a .env file in the /server directory
     ```bash
      MONGO_URI=your_mongodb_connection_string
      PORT=8000
      SECRET_KEY=your_secret_key
      COHERE_API_KEY=your_cohere_api_key_here
     ```
    - Frontend:

      Create a .env file in /client directory
      ```bash
       VITE_API_URL=http://localhost:8000/api
       COHERE_API_KEY=your_cohere_api_key_here
      ```
4. **Run the app:**  
   - Backend: (from `server/`)
     ```bash
     npm run dev
     ```
   - Model: (from `ML/`)
     ```bash
     python ml_server.py
     ```
   - Frontend: (from `client/`)
     ```bash
     npm run dev
     ```
     
---

## 💡 What Makes Us Unique?

- **Sustainability at the Core:** Every feature is designed to nudge users and sellers toward greener choices.
- **Transparent Impact:** Real data, real rewards—no greenwashing.
- **Community-Driven:** Group buys, challenges, and forums foster a sense of shared mission.
- **AI-Enhanced:** Smart recommendations and support for both shoppers and sellers.

---

## Transform Your Shopping, Transform the Planet  

Where every click counts, every purchase matters, and every user becomes an environmental champion.  
**Your Wallet. Your Values. Your Impact.**

---

## Contact

If you have any questions, feedback, or collaboration ideas, feel free to reach out!

**Team Lazy_Coders**  
- Sachin Singh – [GitHub](https://github.com/sachinsingh45) | [Email](mailto:sachinsingh16404@gmail.com)  
- Shashi Prakash – [GitHub](https://github.com/shashi9170) | [Email](mailto:shashipra2002@gmail.com)  
- Alakh Mathur – [GitHub](https://github.com/AlakhMathur) | [Email](mailto:alakhm.ug22.cs@nitp.ac.in)  
- Tushar Srivastava – [GitHub](https://github.com/official-Tushar) | [Email](mailto:tusharsrivastava8404@gmail.com)  

> Built during HackOn With Amazon, 2025
