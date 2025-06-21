import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Calculator, 
  Leaf, 
  Car, 
  Plane, 
  Home, 
  ShoppingBag, 
  ChefHat,
  Zap,
  TrendingDown,
  Target,
  Award,
  Share2,
  Download,
  Lightbulb,
  Cloud,
  Droplets,
  Recycle,
  Bike,
  Bus
} from 'lucide-react';

const CarbonCalculatorPage = () => {
  const [formData, setFormData] = useState({
    transportation: {
      carMiles: 0,
      publicTransport: 0,
      flights: 0,
      bikeMiles: 0
    },
    home: {
      electricity: 0,
      naturalGas: 0,
      water: 0,
      waste: 0
    },
    lifestyle: {
      meatConsumption: 'moderate',
      shopping: 'moderate',
      recycling: 'some'
    }
  });

  const [results, setResults] = useState(null);
  const [showResults, setShowResults] = useState(false);

  const calculateCarbonFootprint = () => {
    let totalCO2 = 0;

    // Transportation calculations
    totalCO2 += formData.transportation.carMiles * 0.404; // kg CO2 per mile
    totalCO2 += formData.transportation.publicTransport * 0.14; // kg CO2 per mile
    totalCO2 += formData.transportation.flights * 0.255; // kg CO2 per mile
    totalCO2 += formData.transportation.bikeMiles * 0; // No emissions

    // Home calculations
    totalCO2 += formData.home.electricity * 0.92; // kg CO2 per kWh
    totalCO2 += formData.home.naturalGas * 2.02; // kg CO2 per cubic meter
    totalCO2 += formData.home.water * 0.298; // kg CO2 per gallon
    totalCO2 += formData.home.waste * 0.5; // kg CO2 per kg of waste

    // Lifestyle adjustments
    const meatMultiplier = {
      high: 1.5,
      moderate: 1.0,
      low: 0.7,
      vegetarian: 0.5
    };

    const shoppingMultiplier = {
      high: 1.3,
      moderate: 1.0,
      low: 0.7
    };

    const recyclingMultiplier = {
      all: 0.8,
      some: 0.9,
      none: 1.0
    };

    totalCO2 *= meatMultiplier[formData.lifestyle.meatConsumption];
    totalCO2 *= shoppingMultiplier[formData.lifestyle.shopping];
    totalCO2 *= recyclingMultiplier[formData.lifestyle.recycling];

    const annualCO2 = totalCO2 * 365;
    const treesNeeded = Math.ceil(annualCO2 / 22); // One tree absorbs ~22kg CO2 per year

    setResults({
      dailyCO2: Math.round(totalCO2 * 100) / 100,
      annualCO2: Math.round(annualCO2),
      treesNeeded,
      category: getCategory(annualCO2),
      recommendations: getRecommendations(annualCO2, formData)
    });

    setShowResults(true);
  };

  const getCategory = (annualCO2) => {
    if (annualCO2 < 2000) return { name: 'Excellent', color: 'text-green-600', bg: 'bg-green-100' };
    if (annualCO2 < 4000) return { name: 'Good', color: 'text-blue-600', bg: 'bg-blue-100' };
    if (annualCO2 < 6000) return { name: 'Average', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    return { name: 'High', color: 'text-red-600', bg: 'bg-red-100' };
  };

  const getRecommendations = (annualCO2, data) => {
    const recommendations = [];

    if (data.transportation.carMiles > 20) {
      recommendations.push({
        title: 'Reduce Car Usage',
        description: 'Consider carpooling, public transport, or cycling for short trips',
        impact: 'Save up to 2,000 kg CO2/year',
        icon: Car
      });
    }

    if (data.home.electricity > 30) {
      recommendations.push({
        title: 'Switch to Renewable Energy',
        description: 'Install solar panels or choose a green energy provider',
        impact: 'Save up to 1,500 kg CO2/year',
        icon: Zap
      });
    }

    if (data.lifestyle.meatConsumption === 'high') {
      recommendations.push({
        title: 'Reduce Meat Consumption',
        description: 'Try meatless Mondays or switch to plant-based alternatives',
        impact: 'Save up to 1,000 kg CO2/year',
        icon: ChefHat
      });
    }

    if (data.lifestyle.recycling === 'none') {
      recommendations.push({
        title: 'Start Recycling',
        description: 'Recycle paper, plastic, glass, and metal waste',
        impact: 'Save up to 500 kg CO2/year',
        icon: Recycle
      });
    }

    return recommendations;
  };

  const handleInputChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <Calculator className="w-10 h-10" />
              <h1 className="text-4xl font-bold">Carbon Calculator</h1>
            </div>
            <p className="text-xl text-green-100 mb-8">
              Calculate your carbon footprint and discover ways to reduce your environmental impact
            </p>
            
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              <div className="bg-white bg-opacity-20 rounded-lg p-4">
                <div className="text-2xl font-bold">Global</div>
                <div className="text-green-100 text-sm">Average: 4.8t</div>
              </div>
              <div className="bg-white bg-opacity-20 rounded-lg p-4">
                <div className="text-2xl font-bold">Target</div>
                <div className="text-green-100 text-sm">2.0t by 2050</div>
              </div>
              <div className="bg-white bg-opacity-20 rounded-lg p-4">
                <div className="text-2xl font-bold">Trees</div>
                <div className="text-green-100 text-sm">22kg CO2/year</div>
              </div>
              <div className="bg-white bg-opacity-20 rounded-lg p-4">
                <div className="text-2xl font-bold">Impact</div>
                <div className="text-green-100 text-sm">Every action counts</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Calculator Form */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Calculate Your Footprint</h2>
            
            {/* Transportation */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="flex items-center space-x-3 mb-4">
                <Car className="w-6 h-6 text-blue-500" />
                <h3 className="text-lg font-semibold text-gray-900">Transportation</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Car miles per day
                  </label>
                  <input
                    type="number"
                    value={formData.transportation.carMiles}
                    onChange={(e) => handleInputChange('transportation', 'carMiles', parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Public transport miles per day
                  </label>
                  <input
                    type="number"
                    value={formData.transportation.publicTransport}
                    onChange={(e) => handleInputChange('transportation', 'publicTransport', parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Flight miles per year
                  </label>
                  <input
                    type="number"
                    value={formData.transportation.flights}
                    onChange={(e) => handleInputChange('transportation', 'flights', parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="0"
                  />
                </div>
              </div>
            </div>

            {/* Home Energy */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="flex items-center space-x-3 mb-4">
                <Home className="w-6 h-6 text-green-500" />
                <h3 className="text-lg font-semibold text-gray-900">Home Energy</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Electricity usage (kWh per day)
                  </label>
                  <input
                    type="number"
                    value={formData.home.electricity}
                    onChange={(e) => handleInputChange('home', 'electricity', parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Natural gas usage (cubic meters per day)
                  </label>
                  <input
                    type="number"
                    value={formData.home.naturalGas}
                    onChange={(e) => handleInputChange('home', 'naturalGas', parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="0"
                  />
                </div>
              </div>
            </div>

            {/* Lifestyle */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="flex items-center space-x-3 mb-4">
                <ShoppingBag className="w-6 h-6 text-purple-500" />
                <h3 className="text-lg font-semibold text-gray-900">Lifestyle</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meat consumption
                  </label>
                  <select
                    value={formData.lifestyle.meatConsumption}
                    onChange={(e) => handleInputChange('lifestyle', 'meatConsumption', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="high">High (daily)</option>
                    <option value="moderate">Moderate (3-4 times/week)</option>
                    <option value="low">Low (1-2 times/week)</option>
                    <option value="vegetarian">Vegetarian</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Shopping habits
                  </label>
                  <select
                    value={formData.lifestyle.shopping}
                    onChange={(e) => handleInputChange('lifestyle', 'shopping', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="high">High (frequent purchases)</option>
                    <option value="moderate">Moderate (occasional)</option>
                    <option value="low">Low (minimal)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Recycling habits
                  </label>
                  <select
                    value={formData.lifestyle.recycling}
                    onChange={(e) => handleInputChange('lifestyle', 'recycling', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="all">Recycle everything possible</option>
                    <option value="some">Recycle some items</option>
                    <option value="none">Don't recycle</option>
                  </select>
                </div>
              </div>
            </div>

            <button
              onClick={calculateCarbonFootprint}
              className="w-full bg-green-500 text-white py-4 rounded-xl hover:bg-green-600 transition-colors font-semibold text-lg"
            >
              Calculate My Carbon Footprint
            </button>
          </div>

          {/* Results */}
          <div className="space-y-6">
            {!showResults ? (
              <div className="bg-white rounded-xl p-8 shadow-lg text-center">
                <Leaf className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Ready to Calculate?</h3>
                <p className="text-gray-600">
                  Fill out the form on the left to see your carbon footprint and get personalized recommendations.
                </p>
              </div>
            ) : (
              <>
                {/* Results Summary */}
                <div className="bg-white rounded-xl p-6 shadow-lg">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Your Carbon Footprint</h3>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600">{results.dailyCO2}</div>
                      <div className="text-sm text-gray-600">kg CO2/day</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600">{results.annualCO2}</div>
                      <div className="text-sm text-gray-600">kg CO2/year</div>
                    </div>
                  </div>
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${results.category.bg} ${results.category.color}`}>
                    {results.category.name} Impact
                  </div>
                </div>

                {/* Trees Needed */}
                <div className="bg-white rounded-xl p-6 shadow-lg">
                  <div className="flex items-center space-x-3 mb-4">
                    <Leaf className="w-6 h-6 text-green-500" />
                    <h3 className="text-lg font-semibold text-gray-900">Offset Your Footprint</h3>
                  </div>
                  <p className="text-gray-600 mb-4">
                    To offset your annual carbon footprint, you would need to plant:
                  </p>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-green-600 mb-2">{results.treesNeeded}</div>
                    <div className="text-gray-600">trees per year</div>
                  </div>
                </div>

                {/* Recommendations */}
                <div className="bg-white rounded-xl p-6 shadow-lg">
                  <div className="flex items-center space-x-3 mb-4">
                    <Lightbulb className="w-6 h-6 text-yellow-500" />
                    <h3 className="text-lg font-semibold text-gray-900">Recommendations</h3>
                  </div>
                  <div className="space-y-4">
                    {results?.recommendations?.map((rec, index) => (
                      <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                        <rec.icon className="w-5 h-5 text-green-500 mt-1" />
                        <div>
                          <h4 className="font-medium text-gray-900">{rec.title}</h4>
                          <p className="text-sm text-gray-600 mb-1">{rec.description}</p>
                          <span className="text-xs text-green-600 font-medium">{rec.impact}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-3">
                  <button className="flex-1 bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition-colors font-medium">
                    <Share2 className="w-4 h-4 inline mr-2" />
                    Share Results
                  </button>
                  <button className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                    <Download className="w-4 h-4 inline mr-2" />
                    Download Report
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarbonCalculatorPage;
