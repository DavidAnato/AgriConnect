import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';

// Backend cart item shape
interface CartItemBackend {
  id: number;
  product: number;
  product_name: string;
  quantity: number | string;
  unit_price: number;
  subtotal: number;
}

interface CartContextType {
  items: CartItemBackend[];
  totalPrice: number;
  addToCart: (product: { id: number }, quantity: number | string) => Promise<void>;
  addItem: (productId: number, quantity: number | string) => Promise<void>;
  updateQuantity: (productId: number, quantity: number | string) => Promise<void>;
  removeFromCart: (productId: number) => Promise<void>;
  clearCart: () => Promise<void>;
  checkout: (shipping_address?: string) => Promise<any[]>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const navigate = useNavigate();
  const [items, setItems] = useState<CartItemBackend[]>([]);
  const [total, setTotal] = useState<number>(0);

  const loadCart = async () => {
    try {
      // Ne pas passer navigate ici pour éviter une redirection globale sur 401
      const cart = await apiService.getCart();
      setItems(cart.items || []);
      setTotal(Number(cart.total || 0));
    } catch (err) {
      // Échec silencieux si non authentifié : garder un panier vide sans redirection
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  const addItem = async (productId: number, quantity: number | string) => {
    const q = typeof quantity === 'number' ? quantity : quantity;
    if (!q || Number(q) <= 0) {
      throw new Error('Quantité invalide');
    }
    const cart = await apiService.addCartItem(productId, q, navigate);
    setItems(cart.items || []);
    setTotal(Number(cart.total || 0));
  };

  const addToCart = async (product: { id: number }, quantity: number | string) => {
    await addItem(product.id, quantity);
  };

  const updateQuantity = async (productId: number, quantity: number | string) => {
    const cart = await apiService.addCartItem(productId, quantity, navigate);
    setItems(cart.items || []);
    setTotal(Number(cart.total || 0));
  };

  const removeFromCart = async (productId: number) => {
    const item = items.find((it) => Number(it.product) === Number(productId));
    if (!item) return;
    const cart = await apiService.removeCartItem(item.id, navigate);
    setItems(cart.items || []);
    setTotal(Number(cart.total || 0));
  };

  const clearCart = async () => {
    const cart = await apiService.clearCart(navigate);
    setItems(cart.items || []);
    setTotal(Number(cart.total || 0));
  };

  const checkout = async (shipping_address?: string) => {
    const orders = await apiService.checkoutCart(
      shipping_address ? { shipping_address } : undefined,
      navigate
    );
    // vider le panier côté frontend après succès
    await clearCart();
    return orders;
  };

  const totalPrice = Number(total || items.reduce((sum, it) => sum + Number(it.subtotal || 0), 0));

  const value = {
    items,
    totalPrice,
    addToCart,
    addItem,
    updateQuantity,
    removeFromCart,
    clearCart,
    checkout,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};