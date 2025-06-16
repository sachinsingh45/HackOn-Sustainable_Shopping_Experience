import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || 'your-gemini-api-key');

export class GeminiAIService {
  private model = genAI.getGenerativeModel({ model: 'gemini-pro' });

  async getEcoAlternatives(product: any, allProducts: any[], userHistory: any[]) {
    const prompt = `
      Analyze this product and suggest eco-friendly alternatives from the available products:
      
      Current Product: ${JSON.stringify(product)}
      
      Available Products: ${JSON.stringify(allProducts.slice(0, 20))} // Limit for context
      
      User Purchase History: ${JSON.stringify(userHistory)}
      
      Please suggest 3-5 eco-friendly alternatives that:
      1. Are in the same category or serve similar purpose
      2. Have better environmental impact
      3. Match user's preferences based on history
      4. Include specific reasons why they're more sustainable
      
      Return response in JSON format:
      {
        "alternatives": [
          {
            "productId": "id",
            "reason": "why it's more eco-friendly",
            "carbonSavings": "estimated CO2 savings",
            "ecoScore": "score out of 100"
          }
        ],
        "insights": "general sustainability insights for this category"
      }
    `;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Parse JSON response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      return { alternatives: [], insights: text };
    } catch (error) {
      console.error('Gemini AI Error:', error);
      return { alternatives: [], insights: 'Unable to generate recommendations at this time.' };
    }
  }

  async analyzeCartSustainability(cartItems: any[], allProducts: any[]) {
    const prompt = `
      Analyze this shopping cart for environmental impact and suggest improvements:
      
      Cart Items: ${JSON.stringify(cartItems)}
      
      Available Eco Products: ${JSON.stringify(allProducts.filter(p => p.isEcoFriendly).slice(0, 15))}
      
      Provide analysis in JSON format:
      {
        "totalCarbonFootprint": "total kg CO2",
        "wasteGenerated": "estimated waste in kg",
        "ecoScore": "overall cart eco score 0-100",
        "improvements": [
          {
            "currentItem": "item name",
            "suggestion": "eco alternative",
            "impact": "environmental benefit"
          }
        ],
        "packagingRecommendations": "suggestions for eco packaging",
        "groupBuyOpportunities": ["products suitable for group buying"]
      }
    `;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      return {
        totalCarbonFootprint: "0",
        wasteGenerated: "0",
        ecoScore: 50,
        improvements: [],
        packagingRecommendations: "Consider eco-friendly packaging options",
        groupBuyOpportunities: []
      };
    } catch (error) {
      console.error('Gemini AI Error:', error);
      return {
        totalCarbonFootprint: "0",
        wasteGenerated: "0",
        ecoScore: 50,
        improvements: [],
        packagingRecommendations: "Consider eco-friendly packaging options",
        groupBuyOpportunities: []
      };
    }
  }

  async generatePersonalizedChallenges(userProfile: any, orderHistory: any[]) {
    const prompt = `
      Generate personalized sustainability challenges for this user:
      
      User Profile: ${JSON.stringify(userProfile)}
      Order History: ${JSON.stringify(orderHistory.slice(-10))} // Last 10 orders
      
      Create 3 monthly challenges in JSON format:
      {
        "challenges": [
          {
            "title": "challenge name",
            "description": "what user needs to do",
            "target": "specific goal",
            "reward": "GreenStars or benefits",
            "difficulty": "easy/medium/hard",
            "category": "packaging/carbon/waste/etc"
          }
        ],
        "motivation": "personalized motivational message"
      }
    `;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      return {
        challenges: [
          {
            title: "Zero Waste Week",
            description: "Choose products with minimal packaging",
            target: "5 eco-friendly purchases",
            reward: "50 GreenStars",
            difficulty: "medium",
            category: "packaging"
          }
        ],
        motivation: "Keep up your great work towards sustainability!"
      };
    } catch (error) {
      console.error('Gemini AI Error:', error);
      return {
        challenges: [],
        motivation: "Keep making sustainable choices!"
      };
    }
  }

  async chatResponse(message: string, context: any) {
    const prompt = `
      You are Green Partner, an AI assistant for Amazon Green - a sustainable shopping platform.
      
      User Message: "${message}"
      
      Context: ${JSON.stringify(context)}
      
      Respond as a helpful, eco-conscious shopping assistant. Provide practical advice about:
      - Sustainable product alternatives
      - Environmental impact of purchases
      - Green shopping tips
      - Carbon footprint reduction
      
      Keep responses conversational, helpful, and focused on sustainability.
      Include specific product recommendations when relevant.
      
      Response should be in JSON format:
      {
        "message": "your response text",
        "suggestions": ["actionable suggestion 1", "suggestion 2"],
        "productRecommendations": ["product id 1", "product id 2"] // if relevant
      }
    `;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      return {
        message: text,
        suggestions: [],
        productRecommendations: []
      };
    } catch (error) {
      console.error('Gemini AI Error:', error);
      return {
        message: "I'm here to help you make sustainable choices! How can I assist you today?",
        suggestions: ["Explore eco-friendly products", "Check your carbon footprint"],
        productRecommendations: []
      };
    }
  }
}

export const geminiAI = new GeminiAIService();