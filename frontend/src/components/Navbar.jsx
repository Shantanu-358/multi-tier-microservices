import React from 'react';
import { ShoppingBag, ShoppingCart, User, LogIn, LogOut, PackageCheck, Layers, PlusCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export function Navbar({ activeTab, setActiveTab, onOpenAuth, onOpenOrders, onOpenCreateProduct }) {
  const { user, isAuthenticated, logout } = useAuth();
  const { cartCount, setIsCartOpen } = useCart();

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('catalog')}>
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/25">
            <Layers className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight text-white font-outfit">Cloud<span className="text-indigo-400">Scale</span></span>
            <span className="block text-xs text-slate-400 font-medium tracking-wide">MICROSERVICES PLATFORM</span>
          </div>
        </div>

        {/* Center Nav Tabs */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-900/60 p-1.5 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('catalog')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'catalog'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            Product Catalog
          </button>
          
          <button
            onClick={() => setActiveTab('architecture')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'architecture'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            System Health & Mesh
          </button>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          
          {/* Add Product Button (Authenticated Users) */}
          {isAuthenticated && (
            <button
              onClick={onOpenCreateProduct}
              className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-indigo-500/40 text-sm font-medium transition-all"
            >
              <PlusCircle className="w-4 h-4 text-indigo-400" />
              <span>Add Item</span>
            </button>
          )}

          {/* User Orders (Authenticated) */}
          {isAuthenticated && (
            <button
              onClick={onOpenOrders}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-indigo-500/40 text-sm font-medium transition-all"
            >
              <PackageCheck className="w-4 h-4 text-cyan-400" />
              <span className="hidden sm:inline">My Orders</span>
            </button>
          )}

          {/* Cart Icon Button */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-indigo-500/40 transition-all"
            aria-label="Open Cart"
          >
            <ShoppingCart className="w-5 h-5 text-indigo-400" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-indigo-500 text-white text-xs font-bold flex items-center justify-center shadow-lg shadow-indigo-500/50 animate-pulse">
                {cartCount}
              </span>
            )}
          </button>

          {/* Auth State Button */}
          {isAuthenticated ? (
            <div className="flex items-center gap-3 pl-2 border-l border-slate-800">
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-xs font-semibold text-slate-200">{user.email}</span>
                <span className="text-[10px] text-emerald-400 font-medium">Logged In</span>
              </div>
              <button
                onClick={logout}
                className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-rose-400 hover:bg-rose-950/40 hover:border-rose-800/40 transition-all"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white text-sm font-semibold shadow-lg shadow-indigo-600/25 transition-all"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In</span>
            </button>
          )}

        </div>
      </div>
    </header>
  );
}
