export interface Product {
  id: number;
  name: string;
  description: string;
  category: string;
  price: number;
  unit: string;
  quantity_available: number;
  location: string;
  image_url?: string;
  status: 'available' | 'reserved' | 'sold_out';
  created_at: string;
  producer?: Producer;
  rating?: number;
  delivery_options?: string[];
}

export interface Producer {
  id: string;
  full_name: string;
  farm_name?: string;
  location: string;
  phone?: string;
  email: string;
  description?: string;
  rating?: number;
}

export interface Order {
  id: number;
  userId: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'delivered' | 'cancelled';
  deliveryAddress: string;
  phone: string;
  createdAt: string;
  updatedAt: string;
  estimatedDeliveryDate?: string;
  consumer?: {
    full_name: string;
    email: string;
    phone?: string;
  };
}

export interface OrderItem {
  productId: number;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}
