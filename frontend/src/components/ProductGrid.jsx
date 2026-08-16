import React, { useState, useEffect } from 'react';
import { Search, RefreshCw, AlertCircle, PlusCircle, Package } from 'lucide-react';
import { ProductCard } from './ProductCard';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export function ProductGrid({ onOpenCreateProduct }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { isAuthenticated } = useAuth();

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getProducts();
      setProducts(data);
    } catch (err) {
      setError(err.message || 'Failed to connect to backend product service.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.description && p.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12" id="catalog">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-extrabold text-white font-outfit">Microservice Components</h2>
          <p className="text-sm text-slate-400 mt-1">Available cloud infrastructure resources and services</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search components..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors w-full sm:w-64"
            />
          </div>

          {/* Refresh Button */}
          <button
            onClick={fetchProducts}
            disabled={loading}
            className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-all disabled:opacity-50"
            title="Refresh Products"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-indigo-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="glass-panel p-6 rounded-2xl border-rose-500/30 bg-rose-950/30 text-rose-200 flex items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-6 h-6 text-rose-400 shrink-0" />
            <div>
              <h4 className="font-semibold text-rose-300">Catalog Connection Error</h4>
              <p className="text-sm text-rose-400/90">{error}</p>
            </div>
          </div>
          <button
            onClick={fetchProducts}
            className="px-4 py-2 rounded-xl bg-rose-900/60 border border-rose-700/50 hover:bg-rose-800/60 text-xs font-semibold text-rose-100 transition-colors"
          >
            Retry Connection
          </button>
        </div>
      )}

      {/* Loading Skeletons */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="glass-panel rounded-2xl p-6 border border-slate-800 animate-pulse h-64 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-slate-800 mb-4" />
                <div className="w-3/4 h-6 rounded bg-slate-800 mb-3" />
                <div className="w-full h-4 rounded bg-slate-800/60 mb-2" />
                <div className="w-2/3 h-4 rounded bg-slate-800/60" />
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-slate-800">
                <div className="w-20 h-6 rounded bg-slate-800" />
                <div className="w-24 h-9 rounded-xl bg-slate-800" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        /* Empty Catalog State */
        <div className="glass-panel rounded-2xl p-12 text-center border border-slate-800 max-w-lg mx-auto my-8">
          <div className="w-16 h-16 rounded-2xl bg-indigo-950/60 border border-indigo-500/30 text-indigo-400 flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-white font-outfit mb-2">No Components Found</h3>
          <p className="text-sm text-slate-400 mb-6">
            {searchTerm ? `No products matching "${searchTerm}"` : 'The database currently contains no product items.'}
          </p>
          {isAuthenticated && (
            <button
              onClick={onOpenCreateProduct}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold shadow-lg shadow-indigo-600/25 transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create First Product</span>
            </button>
          )}
        </div>
      ) : (
        /* Products Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

    </section>
  );
}
