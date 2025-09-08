import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Flower } from '@/types/flower';

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (flower: Flower, quantity?: number) => void;
  removeFromCart: (flowerId: string) => void;
  updateQuantity: (flowerId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartItemsCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('flowerCart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        setCartItems(parsedCart);
      } catch (error) {
        console.error('Error parsing cart from localStorage:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('flowerCart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (flower: Flower, quantity: number = 1) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item.flower.id === flower.id);
      if (existingItem) {
        return prev.map(item =>
          item.flower.id === flower.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { flower, quantity }];
    });
  };

  const removeFromCart = (flowerId: string) => {
    setCartItems(prev => prev.filter(item => item.flower.id !== flowerId));
  };

  const updateQuantity = (flowerId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(flowerId);
      return;
    }
    setCartItems(prev =>
      prev.map(item =>
        item.flower.id === flowerId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.flower.price * item.quantity), 0);
  };

  const getCartItemsCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemsCount
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};