import React, { useState } from 'react';
import { X, PlusCircle, AlertCircle, Loader2 } from 'lucide-react';
import { api } from '../services/api';
import { useToast } from '../context/ToastContext';

export function CreateProductModal({ isOpen, onClose, onProductCreated }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { addToast } = useToast();

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const productData = {
        name,
        description: description || null,
        price: parseFloat(price),
      };

      const newProduct = await api.createProduct(productData);
      addToast(`Product "${newProduct.name}" created!`, 'success');
      if (onProductCreated) onProductCreated(newProduct);
      onClose();
      setName('');
      setDescription('');
      setPrice('');
    } catch (err) {
      setError(err.message || 'Failed to create product.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="glass-modal w-full max-w-md rounded-2xl p-6 sm:p-8 shadow-2xl relative border border-slate-800">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-indigo-950/80 border border-indigo-500/30 text-indigo-400 flex items-center justify-center mx-auto mb-3">
            <PlusCircle className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-bold text-white font-outfit">Add New Component</h3>
          <p className="text-sm text-slate-400 mt-1">Publish item to microservice product catalog</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3.5 rounded-xl bg-rose-950/50 border border-rose-500/30 text-rose-200 text-sm flex items-center gap-2.5 mb-5">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Component Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g., Redis Cache Cluster"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Description
            </label>
            <textarea
              rows={3}
              placeholder="Detailed specs or features..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Monthly Price ($ USD)
            </label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              required
              placeholder="39.99"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-semibold shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-6"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Publishing Item...</span>
              </>
            ) : (
              <span>Add Component to Catalog</span>
            )}
          </button>
        </form>

      </div>
    </div>
  );
}
