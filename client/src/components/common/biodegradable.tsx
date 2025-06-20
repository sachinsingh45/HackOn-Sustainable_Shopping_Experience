import { useState } from 'react';
import axios from 'axios';
import { Sparkles, Info, CheckCircle, XCircle, Clock, Trash2, Lightbulb, AlertCircle, RefreshCw } from 'lucide-react';

interface MaterialAnalysisResult {
  biodegradable: boolean;
  degrades_in?: string;
  disposal?: string;
  eco_tip?: string;
}

interface MaterialAPIResponse {
  success: boolean;
  data?: MaterialAnalysisResult;
  error?: string;
}

export default function MaterialInfoScanner() {
  const [description, setDescription] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<MaterialAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [analyzedMaterial, setAnalyzedMaterial] = useState<string>('');

  const analyzeMaterial = async () => {
    if (!description.trim()) {
      setError('Please enter a material description');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);
    setAnalyzedMaterial(description.trim());

    try {
      const response = await axios.post<MaterialAPIResponse>(
        'https://machine-learning-8crr.onrender.com/analyze-material',
        { description: description.trim() },
        {
          timeout: 60000, // 60 second timeout
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      console.log('API Response:', response.data);

      if (response.data.success && response.data.data) {
        setResult(response.data.data);
      } else {
        setError(response.data.error || 'Analysis failed - no data received');
      }
    } catch (err: any) {
      console.error('Analysis error:', err);
      
      // Handle different types of errors
      if (err.code === 'ECONNABORTED') {
        setError('Request timed out. Please try again.');
      } else if (err.response?.status === 404) {
        setError('Analysis service not available. Please try again later.');
      } else if (err.response?.status >= 500) {
        setError('Server error. Please try again later.');
      } else if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else if (err.message) {
        setError(`Network error: ${err.message}`);
      } else {
        setError('Failed to analyze material. Please check your connection and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    setError(null);
    analyzeMaterial();
  };

  const clearResults = () => {
    setResult(null);
    setError(null);
    setAnalyzedMaterial('');
    setDescription('');
  };

  // Show input section only when there's no result and no error
  const showInputSection = !result && !error;

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full mb-4">
          <Sparkles className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Green Lens Analysis
        </h1>
        <p className="text-gray-600">
          Analyze any product's environmental impact and sustainability
        </p>
      </div>

      {/* Input Section - Only show when no result/error */}
      {showInputSection && (
        <>
          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-start space-x-3">
              <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-blue-900 mb-1">How to use Text Analysis</h3>
                <p className="text-blue-800 text-sm">
                  Describe the product or material you want to analyze. Be specific about the material type, 
                  packaging, and any other relevant details for the most accurate results.
                </p>
              </div>
            </div>
          </div>

          {/* Examples */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-3 mb-6">
            <button
              onClick={() => setDescription('plastic water bottle')}
              className="text-left p-3 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors"
            >
              <div className="font-medium text-gray-900">Plastic Water Bottle</div>
              <div className="text-sm text-gray-600">Standard PET bottle</div>
            </button>
            <button
              onClick={() => setDescription('paper coffee cup with plastic lining')}
              className="text-left p-3 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors"
            >
              <div className="font-medium text-gray-900">Coffee Cup</div>
              <div className="text-sm text-gray-600">Paper with plastic lining</div>
            </button>
            <button
              onClick={() => setDescription('cotton t-shirt')}
              className="text-left p-3 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors"
            >
              <div className="font-medium text-gray-900">Cotton T-Shirt</div>
              <div className="text-sm text-gray-600">100% cotton fabric</div>
            </button>
            <button
              onClick={() => setDescription('aluminum can')}
              className="text-left p-3 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors"
            >
              <div className="font-medium text-gray-900">Aluminum Can</div>
              <div className="text-sm text-gray-600">Beverage container</div>
            </button>
          </div>

          {/* Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Describe the product or material
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-green-400 outline-none resize-none text-gray-900"
              placeholder="e.g., 'plastic water bottle', 'paper coffee cup with plastic lining', 'cotton t-shirt', 'aluminum can'..."
              disabled={loading}
            />
          </div>

          <button
            onClick={analyzeMaterial}
            disabled={loading || !description.trim()}
            className={`w-full py-4 font-semibold rounded-lg text-white transition-all duration-200 mb-6 ${
              loading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : description.trim()
                ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                : 'bg-gray-300 cursor-not-allowed'
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Analyzing...
              </span>
            ) : (
              <span className="flex items-center justify-center">
                <Sparkles className="w-5 h-5 mr-2" />
                Analyze Material
              </span>
            )}
          </button>
        </>
      )}

      {/* Error Message */}
      {error && (
        <div className="mt-6 p-6 bg-red-50 border border-red-200 rounded-xl">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-6 h-6 text-red-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-red-900">Analysis Failed</h3>
                <button
                  onClick={clearResults}
                  className="text-red-600 hover:text-red-800 text-sm font-medium"
                >
                  Clear
                </button>
              </div>
              <p className="text-red-700 mb-3">{error}</p>
              <div className="flex space-x-3">
                <button
                  onClick={handleRetry}
                  className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Try Again</span>
                </button>
                <button
                  onClick={() => setError(null)}
                  className="text-red-600 hover:text-red-800 text-sm font-medium"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="mt-6 bg-gradient-to-br from-green-50 to-blue-50 border border-green-200 rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Analysis Complete</h2>
                  <p className="text-green-100 text-sm">Analyzed: {analyzedMaterial}</p>
                </div>
              </div>
              <button
                onClick={clearResults}
                className="text-white hover:text-gray-200 transition-colors text-sm"
              >
                Clear
              </button>
            </div>
          </div>
          
          <div className="p-6 space-y-4">
            {/* Biodegradable */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-white rounded-lg shadow-sm border border-gray-100 gap-2 sm:gap-0">
              <div className="flex items-center space-x-3">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  result.biodegradable ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  {result.biodegradable ? (
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  ) : (
                    <XCircle className="w-6 h-6 text-red-600" />
                  )}
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Biodegradable</div>
                  <div className="text-xs sm:text-sm text-gray-600">Natural decomposition</div>
                </div>
              </div>
              <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                result.biodegradable 
                  ? 'bg-green-100 text-green-800 border border-green-200' 
                  : 'bg-red-100 text-red-800 border border-red-200'
              }`}>
                {result.biodegradable ? 'Yes' : 'No'}
              </span>
            </div>

            {/* Degrades In */}
            {result.degrades_in && (
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-white rounded-lg shadow-sm border border-gray-100 gap-2 sm:gap-0">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Degradation Time</div>
                    <div className="text-xs sm:text-sm text-gray-600">Natural breakdown period</div>
                  </div>
                </div>
                <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium border border-blue-200">
                  {result.degrades_in}
                </span>
              </div>
            )}

            {/* Disposal Method */}
            {result.disposal && (
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-white rounded-lg shadow-sm border border-gray-100 gap-2 sm:gap-0">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Trash2 className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Disposal Method</div>
                    <div className="text-xs sm:text-sm text-gray-600">Recommended disposal</div>
                  </div>
                </div>
                <span className="px-4 py-2 bg-orange-100 text-orange-800 rounded-full text-sm font-medium border border-orange-200">
                  {result.disposal}
                </span>
              </div>
            )}

            {/* Eco Tip */}
            {result.eco_tip && (
              <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-100">
                <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Lightbulb className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 mb-2">Eco Tip</div>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {result.eco_tip}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Summary Card */}
            <div className="mt-6 p-4 bg-gradient-to-r from-green-100 to-blue-100 rounded-lg border border-green-200">
              <div className="text-center">
                <h3 className="font-semibold text-gray-900 mb-2 text-base sm:text-lg">Environmental Impact Summary</h3>
                <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                  <div className="text-center">
                    <div className={`text-2xl font-bold ${result.biodegradable ? 'text-green-600' : 'text-red-600'}`}>
                      {result.biodegradable ? '🌱' : '⚠️'}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-600">Biodegradable</div>
                  </div>
                  {result.degrades_in && (
                    <div className="text-center">
                      <div className="text-lg font-semibold text-blue-600">
                        {result.degrades_in}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-600">Breakdown Time</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
