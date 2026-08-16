import React, { useState } from 'react';
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight, Loader2, LogIn, AlertCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export function CartModal({ onOpenAuth }) {
  const { items, isCartOpen, setIsCartOpen, updateQuantity, removeFromCart, cartTotal, submitOrder, isSubmitting } = useCart();
  const { isAuthenticated } = useAuth();
  const { addToast } = useToast();
  const [error, setError] = useState(null);

  if (!isCartOpen) return null;

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      setIsCartOpen(false);
      onOpenAuth();
      addToast('Please sign in to place an order.', 'info');
      return;
    }

    setError(null);
    try {
      const order = await submitOrder();
      if (order) {
        addToast(`Order #${order.id} placed successfully!`, 'success');
      }
    } catch (err) {
      setError(err.message || 'Failed to submit order.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="glass-modal w-full max-w-md h-full flex flex-col justify-between shadow-2xl border-l border-slate-800 relative">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-950/80 border border-indigo-500/30 text-indigo-400">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white font-outfit">Shopping Cart</h3>
              <p className="text-xs text-slate-400">{items.length} item(s) selected</p>
            </div>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mx-6 mt-4 p-3.5 rounded-xl bg-rose-950/50 border border-rose-500/30 text-rose-200 text-sm flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {items.length === 0 ? (
            <div className="text-center py-16 text-slate-500">
              <ShoppingBag className="w-12 h-12 mx-auto mb-3 text-slate-600 stroke-[1.5]" />
              <p className="text-base font-semibold text-slate-400">Your cart is empty</p>
              <p className="text-xs mt-1">Add items from the product catalog to get started.</p>
            </div>
          ) : (
            items.map(({ product, quantity }) => (
              <div key={product.id} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-white truncate font-outfit">{product.name}</h4>
                  <span className="text-xs text-indigo-400 font-bold">${parseFloat(product.price).toFixed(2)} each</span>
                </div>

                {/* Quantity Buttons */}
                <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-lg border border-slate-800">
                  <button
                    onClick={() => updateQuantity(product.id, -1)}
                    className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-xs font-bold text-slate-200 px-2 min-w-6 text-center">{quantity}</span>
                  <button
                    onClick={() => updateQuantity(product.id, 1)}
                    className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Remove Button */}
                <button
                  onClick={() => removeFromCart(product.id)}
                  className="p-2 text-slate-500 hover:text-rose-400 transition-colors"
                  title="Remove item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer & Checkout */}
        {items.length > 0 && (
          <div className="p-6 border-t border-slate-800 bg-slate-950/60">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-medium text-slate-400">Total Order Amount</span>
              <span className="text-2xl font-extrabold text-white font-outfit">${cartTotal.toFixed(2)}</span>
            </div>

            <button
              onClick={handleCheckout}
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-semibold shadow-xl shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Submitting Order...</span>
                </>
              ) : !isAuthenticated ? (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>Sign In to Complete Order</span>
                </>
              ) : (
                <>
                  <span>Submit Order</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
