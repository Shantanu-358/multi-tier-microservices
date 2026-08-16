import React, { useState, useEffect } from 'react';
import { X, PackageCheck, RefreshCw, AlertCircle, Clock, CheckCircle, Hourglass } from 'lucide-react';
import { api } from '../services/api';

export function OrdersModal({ isOpen, onClose }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getOrders();
      setOrders(data);
    } catch (err) {
      setError(err.message || 'Failed to load order history.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchOrders();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const getStatusBadge = (status) => {
    const s = (status || '').toLowerCase();
    if (s === 'completed') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/70 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
          <CheckCircle className="w-3.5 h-3.5" />
          <span>Completed</span>
        </span>
      );
    }
    if (s === 'processing') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/70 border border-cyan-500/30 text-cyan-300 text-xs font-semibold">
          <Hourglass className="w-3.5 h-3.5 animate-spin" />
          <span>Processing</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950/70 border border-amber-500/30 text-amber-300 text-xs font-semibold">
        <Clock className="w-3.5 h-3.5" />
        <span>Pending</span>
      </span>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="glass-modal w-full max-w-2xl max-h-[85vh] rounded-2xl p-6 sm:p-8 shadow-2xl flex flex-col relative border border-slate-800">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-950/80 border border-cyan-500/30 text-cyan-400">
              <PackageCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white font-outfit">My Order History</h3>
              <p className="text-xs text-slate-400">Transactions processed by backend REST service</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchOrders}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
              title="Refresh Orders"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-cyan-400' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3.5 rounded-xl bg-rose-950/50 border border-rose-500/30 text-rose-200 text-sm flex items-center gap-2.5 mb-4">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Orders Content */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          {loading ? (
            <div className="py-12 text-center text-slate-400">
              <RefreshCw className="w-8 h-8 mx-auto mb-2 animate-spin text-cyan-400" />
              <p className="text-sm">Fetching order records...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="py-16 text-center text-slate-500">
              <PackageCheck className="w-12 h-12 mx-auto mb-3 text-slate-600 stroke-[1.5]" />
              <p className="text-base font-semibold text-slate-400">No Orders Found</p>
              <p className="text-xs text-slate-500 mt-1">Place an order from the product catalog to view history here.</p>
            </div>
          ) : (
            orders.map((order) => (
              <div key={order.id} className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="text-base font-bold text-white font-outfit">Order #{order.id}</span>
                    {getStatusBadge(order.status)}
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    Placed: {order.created_at ? new Date(order.created_at).toLocaleString() : 'Recent'}
                  </div>
                </div>

                <div className="text-left sm:text-right border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-800">
                  <span className="text-xs text-slate-400 block font-medium">Total Price</span>
                  <span className="text-xl font-extrabold text-white font-outfit">
                    ${parseFloat(order.total_amount).toFixed(2)}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}
