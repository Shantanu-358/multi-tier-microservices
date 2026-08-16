import React from 'react';
import { ShoppingCart, Server, Shield, Database, Cpu, HardDrive } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

export function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { addToast } = useToast();

  const handleAddToCart = () => {
    addToCart(product);
    addToast(`Added "${product.name}" to cart!`, 'success');
  };

  // Helper icon selector based on product name
  const getProductIcon = (name) => {
    const nameLower = (name || '').toLowerCase();
    if (nameLower.includes('database') || nameLower.includes('postgresql')) {
      return <Database className="w-6 h-6 text-cyan-400" />;
    }
    if (nameLower.includes('gateway') || nameLower.includes('api')) {
      return <Shield className="w-6 h-6 text-purple-400" />;
    }
    if (nameLower.includes('storage') || nameLower.includes('drive')) {
      return <HardDrive className="w-6 h-6 text-emerald-400" />;
    }
    return <Server className="w-6 h-6 text-indigo-400" />;
  };

  return (
    <div className="glass-panel glass-panel-hover rounded-2xl p-6 flex flex-col justify-between border border-slate-800/80 group">
      <div>
        {/* Header Badge & Icon */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 group-hover:border-indigo-500/40 transition-colors">
            {getProductIcon(product.name)}
          </div>
          <span className="px-3 py-1 rounded-full bg-indigo-950/60 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
            ID #{product.id}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-white group-hover:text-indigo-300 transition-colors font-outfit mb-2">
          {product.name}
        </h3>

        {/* Description */}
        <p className="text-sm text-slate-400 line-clamp-3 leading-relaxed mb-6 font-light">
          {product.description || 'Enterprise microservice component with auto-scaling capabilities and high availability.'}
        </p>
      </div>

      {/* Pricing & Add to Cart Footer */}
      <div className="pt-4 border-t border-slate-800/60 flex items-center justify-between gap-3 mt-auto">
        <div>
          <span className="text-xs text-slate-400 block font-medium">Monthly Price</span>
          <span className="text-2xl font-extrabold text-white tracking-tight font-outfit">
            ${parseFloat(product.price).toFixed(2)}
          </span>
        </div>

        <button
          onClick={handleAddToCart}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold shadow-lg shadow-indigo-600/25 transition-all transform active:scale-95"
        >
          <ShoppingCart className="w-4 h-4" />
          <span>Add</span>
        </button>
      </div>
    </div>
  );
}
