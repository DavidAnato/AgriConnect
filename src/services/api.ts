import productsData from '../data/products.json';
import usersData from '../data/users.json';
import ordersData from '../data/orders.json';

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  unit: string;
  category: string;
  stock: number;
  image_url: string;
  producer_id: number;
  origin?: string;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: number;
  email: string;
  password: string;
  full_name: string;
  role: 'producer' | 'consumer' | 'admin';
  farm_name?: string;
  address?: string;
  phone: string;
  bio?: string;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  product_id: number;
  quantity: number;
  unit_price: number;
}

export interface Order {
  id: number;
  user_id: number;
  items: OrderItem[];
  total_amount: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  delivery_address: string;
  delivery_date: string;
  created_at: string;
  updated_at: string;
}

// Simuler un délai de réseau
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

class ApiService {
  // Produit
  async getProducts(): Promise<Product[]> {
    await delay(300);
    return productsData as Product[];
  }

  async getProductById(id: number): Promise<Product | null> {
    await delay(200);
    const product = (productsData as Product[]).find(p => p.id === id);
    return product || null;
  }

  async getProductsByProducer(producerId: number): Promise<Product[]> {
    await delay(250);
    return (productsData as Product[]).filter(p => p.producer_id === producerId);
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    await delay(250);
    return (productsData as Product[]).filter(p => p.category === category);
  }

  async createProduct(product: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<Product> {
    await delay(400);
    const newProduct: Product = {
      ...product,
      id: Math.max(...(productsData as Product[]).map(p => p.id)) + 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    (productsData as Product[]).push(newProduct);
    return newProduct;
  }

  async updateProduct(id: number, updates: Partial<Product>): Promise<Product | null> {
    await delay(300);
    const index = (productsData as Product[]).findIndex(p => p.id === id);
    if (index === -1) return null;
    
    (productsData as Product[])[index] = {
      ...(productsData as Product[])[index],
      ...updates,
      updated_at: new Date().toISOString()
    };
    return (productsData as Product[])[index];
  }

  // Utilisateurs
  async getUsers(): Promise<User[]> {
    await delay(300);
    return usersData as User[];
  }

  async getUserById(id: number): Promise<User | null> {
    await delay(200);
    const user = (usersData as User[]).find(u => u.id === id);
    return user || null;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    await delay(200);
    const user = (usersData as User[]).find(u => u.email === email);
    return user || null;
  }

  async createUser(user: Omit<User, 'id' | 'created_at' | 'updated_at'>): Promise<User> {
    await delay(400);
    const newUser: User = {
      ...user,
      id: Math.max(...(usersData as User[]).map(u => u.id)) + 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    (usersData as User[]).push(newUser);
    return newUser;
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User | null> {
    await delay(300);
    const index = (usersData as User[]).findIndex(u => u.id === id);
    if (index === -1) return null;
    
    (usersData as User[])[index] = {
      ...(usersData as User[])[index],
      ...updates,
      updated_at: new Date().toISOString()
    };
    return (usersData as User[])[index];
  }

  async deleteUser(id: number): Promise<boolean> {
    await delay(300);
    const index = (usersData as User[]).findIndex(u => u.id === id);
    if (index === -1) return false;
    
    (usersData as User[]).splice(index, 1);
    return true;
  }

  // Authentification
  async login(email: string, password: string): Promise<User | null> {
    await delay(500);
    const user = (usersData as User[]).find(u => u.email === email && u.password === password);
    return user || null;
  }

  async register(userData: {
    email: string;
    password: string;
    role: 'consumer' | 'producer';
    full_name: string;
    phone: string;
    farm_name?: string;
    address?: string;
  }): Promise<User> {
    await delay(600);
    
    // Vérifier si l'email existe déjà
    const existingUser = (usersData as User[]).find(u => u.email === userData.email);
    if (existingUser) {
      throw new Error('Email déjà utilisé');
    }
    
    // Créer le nouvel utilisateur
    const newUser: User = {
      id: Math.max(...(usersData as User[]).map(u => u.id)) + 1,
      email: userData.email,
      password: userData.password,
      full_name: userData.full_name,
      role: userData.role,
      phone: userData.phone,
      farm_name: userData.farm_name,
      address: userData.address,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    (usersData as User[]).push(newUser);
    return newUser;
  }

  // Commandes
  async getOrders(): Promise<Order[]> {
    await delay(300);
    return ordersData.map(order => ({
      id: order.id,
      userId: order.user_id,
      items: order.items.map(item => ({
        productId: item.product_id,
        quantity: item.quantity,
        unitPrice: item.unit_price,
        subtotal: item.quantity * item.unit_price
      })),
      total: order.total_amount,
      status: order.status,
      deliveryAddress: order.delivery_address,
      phone: '',
      createdAt: order.created_at,
      updatedAt: order.updated_at,
      estimatedDeliveryDate: order.delivery_date
    }));
  }

  async getOrdersByUser(userId: string): Promise<Order[]> {
    const orders = await this.getOrders();
    return orders.filter(order => order.userId === userId);
  }

  async getOrderById(id: number): Promise<Order | null> {
    await delay(200);
    const order = (ordersData as Order[]).find(o => o.id === id);
    return order || null;
  }

  // Créer une commande
  async createOrder(order: Omit<Order, 'id' | 'created_at' | 'updated_at'>): Promise<Order> {
    await delay(400);
    const newOrder: Order = {
      ...order,
      id: Math.max(...(ordersData as Order[]).map(o => o.id)) + 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    (ordersData as Order[]).push(newOrder);
    return newOrder;
  }

  async updateOrder(id: number, updates: Partial<Order>): Promise<Order | null> {
    await delay(300);
    const index = (ordersData as Order[]).findIndex(o => o.id === id);
    if (index === -1) return null;
    
    (ordersData as Order[])[index] = {
      ...(ordersData as Order[])[index],
      ...updates,
      updated_at: new Date().toISOString()
    };
    return (ordersData as Order[])[index];
  }

  async deleteOrder(id: number): Promise<boolean> {
    await delay(300);
    const index = (ordersData as Order[]).findIndex(o => o.id === id);
    if (index === -1) return false;
    
    (ordersData as Order[]).splice(index, 1);
    return true;
  }
}

export const apiService = new ApiService();
export default apiService;