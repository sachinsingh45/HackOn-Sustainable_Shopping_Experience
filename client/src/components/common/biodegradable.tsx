import { useState } from 'react';
import axios from 'axios';

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

  const analyzeMaterial = async () => {
    if (!description.trim()) {
      setError('Please enter a material description');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await axios.post<MaterialAPIResponse>(
        'https://machine-learning-8crr.onrender.com/analyze-material',
        { description }
      );

      if (response.data.success && response.data.data) {
        setResult(response.data.data);
      } else {
        setError(response.data.error || 'Analysis failed');
      }
    } catch (err: any) {
      console.error('Analysis error:', err);
      setError(
        err.response?.data?.error ||
        err.response?.data?.message ||
        err.message ||
        'Failed to analyze material'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-2 bg-white rounded-2xl">
      <h1 className="text-3xl font-bold text-center text-green-700 mb-6">
        🌿 Biodegradability Assistant
      </h1>

      <textarea
        rows={3}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 outline-none resize-none text-black"
        placeholder="Describe the material (e.g., 'plastic water bottle', 'paper coffee cup with plastic lining')..."
      />

      <button
        onClick={analyzeMaterial}
        disabled={loading || !description.trim()}
        className={`w-full mt-1 py-3 font-medium rounded-lg text-white transition-colors ${
          loading ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'
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
          'Analyze Material'
        )}
      </button>

      {error && (
        <div className="mt-3 p-3 bg-red-100 text-red-700 rounded-lg">
          <div className="mt-1 text-sm">
            🙏 Please try again later.
          </div>
        </div>
      )}

      {result && (
        <div className="mt-3 p-3 bg-gradient-to-br from-green-50 to-green-100 border border-green-300 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center gap-2 mb-3">
            <div className="bg-green-100 p-2 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-green-900">Eco Analysis Results</h2>
          </div>

          <div className="space-y-4">
            {/* Biodegradable */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
              <span className="font-medium text-green-800 sm:w-40 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                Biodegradable
              </span>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                result.biodegradable 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {result.biodegradable ? (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Yes
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    No
                  </>
                )}
              </span>
            </div>

            {/* Degrades In */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
              <span className="font-medium text-green-800 sm:w-40 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Degrades In
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                {result.degrades_in || 'N/A'}
              </span>
            </div>

            {/* Disposal Method */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
              <span className="font-medium text-green-800 sm:w-40 flex items-center gap-2 text-nowrap">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Disposal Method
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                {result.disposal || 'N/A'}
              </span>
            </div>

            {/* Eco Tip */}
            {result.eco_tip && (
              <div className="pt-1 mt-1 border-t border-green-200">
                <div className="flex items-center gap-2 text-green-800 mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  <p className="font-medium">Eco Tip</p>
                </div>
                <p className="text-gray-700 pl-7 bg-green-50 p-2 rounded-lg text-sm leading-relaxed">
                  {result.eco_tip}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
