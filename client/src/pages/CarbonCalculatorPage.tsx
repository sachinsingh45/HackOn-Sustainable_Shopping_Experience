import React, { useState } from 'react';
import axios from 'axios';

const PRODUCT_PRESETS: Record<string, any> = {
  Laptop: {
    weight: 1.5,
    distance: 500,
    recyclable: true,
    repairable: false,
    lifespan: 5,
    packaging: 'Cardboard',
    category: 'electronics',
    subcategory: 'laptop',
    materialComposition: 'Aluminum:60, Plastic:30, Silicon:10',
  },
  'T-shirt': {
    weight: 0.2,
    distance: 200,
    recyclable: true,
    repairable: false,
    lifespan: 2,
    packaging: 'Plastic',
    category: 'fashion',
    subcategory: 'tshirt',
    materialComposition: 'Cotton:100',
  },
  Bottle: {
    weight: 0.1,
    distance: 100,
    recyclable: true,
    repairable: false,
    lifespan: 1,
    packaging: 'Plastic',
    category: 'home',
    subcategory: 'bottle',
    materialComposition: 'Plastic:100',
  },
  'Mobile Phone': {
    weight: 0.18,
    distance: 400,
    recyclable: true,
    repairable: false,
    lifespan: 3,
    packaging: 'Cardboard',
    category: 'electronics',
    subcategory: 'mobile',
    materialComposition: 'Aluminum:30, Plastic:30, Silicon:20, Glass:20',
  },
};

const packagingOptions = ['Cardboard', 'Plastic', 'Biodegradable', 'Mixed'];
const categoryOptions = ['electronics', 'fashion', 'home', 'beauty'];

const CarbonCalculatorPage: React.FC = () => {
  const [form, setForm] = useState({
    productType: '',
    weight: '',
    distance: '',
    recyclable: false,
    repairable: false,
    lifespan: '',
    packaging: '',
    category: '',
    subcategory: '',
    materialComposition: '',
  });
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string|null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const input = e.target as HTMLInputElement;
      setForm(f => ({ ...f, [name]: input.checked }));
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
  };

  const handlePreset = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const preset = PRODUCT_PRESETS[e.target.value];
    if (preset) {
      setForm({ productType: e.target.value, ...preset });
    } else {
      setForm(f => ({ ...f, productType: e.target.value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    let materialObj: Record<string, number> = {};
    try {
      form.materialComposition.split(',').forEach(pair => {
        const [mat, val] = pair.split(':');
        if (mat && val) materialObj[mat.trim()] = Number(val.trim());
      });
    } catch {
      setError('Material composition must be in the format: Aluminum:50, Plastic:50');
      setLoading(false);
      return;
    }
    // Prepare all material fields
    const allMaterials = [
      'Aluminum', 'Silicon', 'Plastic', 'Glass', 'Steel', 'Organic', 'Copper', 'Insulation Foam', 'Paper', 'Cotton'
    ];
    const materialFeatures: Record<string, number> = {};
    allMaterials.forEach(mat => {
      materialFeatures[`Material_${mat}`] = materialObj[mat] || 0;
    });
    try {
      const mlServerUrl = import.meta.env.VITE_ML_SERVER_URL || 'http://127.0.0.1:8001';
      const res = await axios.post(`${mlServerUrl}/predict`, {
        'Weight (kg)': form.weight ? Number(form.weight) : 1,
        'Distance (km)': form.distance ? Number(form.distance) : 100,
        'Recyclable': form.recyclable ? 1 : 0,
        'Repairable': form.repairable ? 1 : 0,
        'Lifespan (yrs)': form.lifespan ? Number(form.lifespan) : 2,
        'Packaging Used': form.packaging || 'Cardboard',
        'Category': form.category ? form.category.charAt(0).toUpperCase() + form.category.slice(1) : 'General',
        'Subcategory': form.subcategory ? form.subcategory.charAt(0).toUpperCase() + form.subcategory.slice(1) : '',
        ...materialFeatures
      });
      setResult(res.data);
    } catch (err: any) {
      setError(err.response?.data?.detail || err.response?.data?.message || err.message || 'Failed to get prediction');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-12">
      <h2 className="text-2xl font-bold mb-6">Carbon Footprint & Eco Score Calculator</h2>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow">
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Product Type (optional)</label>
          <select name="productType" value={form.productType} onChange={handlePreset} className="border p-2 rounded w-full">
            <option value="">Select a product type...</option>
            {Object.keys(PRODUCT_PRESETS).map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          <span className="text-xs text-gray-500">Choosing a type will auto-fill typical values. You can still edit them.</span>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <input name="weight" value={form.weight} onChange={handleChange} placeholder="Weight (kg)" className="border p-2 rounded" type="number" min="0" step="0.01" required />
          <input name="distance" value={form.distance} onChange={handleChange} placeholder="Distance (km)" className="border p-2 rounded" type="number" min="0" required />
          <input name="lifespan" value={form.lifespan} onChange={handleChange} placeholder="Lifespan (years)" className="border p-2 rounded" type="number" min="0" required />
          <select name="packaging" value={form.packaging} onChange={handleChange} className="border p-2 rounded" required>
            <option value="">Select Packaging</option>
            {packagingOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
          <select name="category" value={form.category} onChange={handleChange} className="border p-2 rounded" required>
            <option value="">Select Category</option>
            {categoryOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
          <input name="subcategory" value={form.subcategory} onChange={handleChange} placeholder="Subcategory (optional)" className="border p-2 rounded" />
          <label className="flex items-center col-span-2">
            <input name="recyclable" type="checkbox" checked={!!form.recyclable} onChange={handleChange} className="mr-2" />
            Recyclable?
                  </label>
          <label className="flex items-center col-span-2">
            <input name="repairable" type="checkbox" checked={!!form.repairable} onChange={handleChange} className="mr-2" />
            Repairable?
                  </label>
                </div>
                <div>
          <label className="block text-sm font-medium mb-1">Material Composition (e.g. 'Aluminum:50, Plastic:50')</label>
          <textarea name="materialComposition" value={form.materialComposition} onChange={handleChange} className="border p-2 rounded w-full" required rows={2} />
          <span className="text-xs text-gray-500">Enter as comma-separated values. Example: Aluminum:50, Plastic:50</span>
                </div>
        <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded font-semibold" disabled={loading}>{loading ? 'Calculating...' : 'Calculate'}</button>
        {error && <div className="text-red-600 font-medium mt-2">{error}</div>}
      </form>
      {result && (
        <div className="mt-8 bg-green-50 p-6 rounded-lg text-lg">
          <div className="mb-2">Carbon Footprint: <span className="font-bold">{result.carbon_footprint} kg CO₂e</span></div>
          <div className="mb-2">Eco Score: <span className="font-bold">{(result.eco_score * 100).toFixed(1)}/100</span></div>
          {result.isEcoFriendly !== undefined && (
            <div className="mb-2">Eco Friendly: <span className="font-bold">{result.isEcoFriendly ? 'Yes' : 'No'}</span></div>
          )}
        </div>
      )}
    </div>
  );
};

export default CarbonCalculatorPage;
