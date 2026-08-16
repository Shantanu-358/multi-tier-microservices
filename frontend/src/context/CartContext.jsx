import React, { createContext, useContext, useState } from 'react';
import { api } from '../services/api';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addToCart = (product) => {
    setItems((prevItems) => {
      const existing = prevItems.find((item) => item.product.id === product.id);
      if (existing) {
        return prevItems.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevItems, { product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId) => {
    setItems((prevItems) => prevItems.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId, delta) => {
    setItems((prevItems) =>
      prevItems
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const cartTotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const submitOrder = async () => {
    if (items.length === 0) return null;
    setIsSubmitting(true);
    try {
      const orderData = {
        total_amount: parseFloat(cartTotal.toFixed(2)),
        status: 'completed',
      };
      const result = await api.createOrder(orderData);
      clearCart();
      setIsCartOpen(false);
      return result;
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <CartContext.Provider
      value={{
        items,
        isCartOpen,
        setIsCartOpen,
        isSubmitting,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        cartCount,
        submitOrder,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}
