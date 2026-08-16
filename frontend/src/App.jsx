import React, { useState } from 'react';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ProductGrid } from './components/ProductGrid';
import { ArchitectureView } from './components/ArchitectureView';
import { AuthModal } from './components/AuthModal';
import { CartModal } from './components/CartModal';
import { OrdersModal } from './components/OrdersModal';
import { CreateProductModal } from './components/CreateProductModal';

function MainApp() {
  const [activeTab, setActiveTab] = useState('catalog'); // 'catalog' | 'architecture'
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isOrdersModalOpen, setIsOrdersModalOpen] = useState(false);
  const [isCreateProductModalOpen, setIsCreateProductModalOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#0b0f19] text-slate-100 font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Glass Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onOpenOrders={() => setIsOrdersModalOpen(true)}
        onOpenCreateProduct={() => setIsCreateProductModalOpen(true)}
      />

      {/* Main Content Body */}
      <main className="flex-1">
        {activeTab === 'catalog' ? (
          <>
            <Hero onExplore={() => {
              const el = document.getElementById('catalog');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }} />
            <ProductGrid onOpenCreateProduct={() => setIsCreateProductModalOpen(true)} />
          </>
        ) : (
          <ArchitectureView />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/60 py-8 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="font-outfit font-bold text-slate-300 text-sm">CloudScale Microservices Platform</span>
          <span>FastAPI • PostgreSQL 16 • Nginx Gateway • Vite + React</span>
        </div>
      </footer>

      {/* Dialog Modals */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      <CartModal
        onOpenAuth={() => setIsAuthModalOpen(true)}
      />

      <OrdersModal
        isOpen={isOrdersModalOpen}
        onClose={() => setIsOrdersModalOpen(false)}
      />

      <CreateProductModal
        isOpen={isCreateProductModalOpen}
        onClose={() => setIsCreateProductModalOpen(false)}
        onProductCreated={() => {
          // Trigger tab refresh if needed
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <CartProvider>
          <MainApp />
        </CartProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
