import { useState, useEffect } from 'react';
import { CartItem, Flower } from '@/types/flower';

export const useCart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  console.log('useCart hook initialized');

  // Load cart from localStorage on mount
  useEffect(() => {
    console.log('Loading cart from localStorage');
    const savedCart = localStorage.getItem('flowerCart');
    if (savedCart) {
      const parsedCart = JSON.parse(savedCart);
      console.log('Loaded cart from localStorage:', parsedCart);
      setCartItems(parsedCart);
    } else {
      console.log('No saved cart found in localStorage');
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

  return {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemsCount
  };
};