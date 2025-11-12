// src/utils/api.ts
import { API_URL } from "./env";
// Gestion du localStorage pour l'auth
const getAccessToken = (): string | null => {
  return localStorage.getItem('accessToken');
};

const getRefreshToken = (): string | null => {
  return localStorage.getItem('refreshToken');
};

const setAccessToken = (token: string): void => {
  localStorage.setItem('accessToken', token);
};

const setRefreshToken = (token: string): void => {
  localStorage.setItem('refreshToken', token);
};

const deleteAccessToken = (): void => {
  localStorage.removeItem('accessToken');
};

const deleteRefreshToken = (): void => {
  localStorage.removeItem('refreshToken');
};

const clearAuth = (): void => {
  deleteAccessToken();
  deleteRefreshToken();
};

// Gestion du localStorage pour les données utilisateur
const getUserData = (): any | null => {
  const userData = localStorage.getItem('userData');
  return userData ? JSON.parse(userData) : null;
};

const setUserData = (data: any): void => {
  localStorage.setItem('userData', JSON.stringify(data));
};

const deleteUserData = (): void => {
  localStorage.removeItem('userData');
};

// Fonction pour vider complètement les données de l'utilisateur
const clearAllUserData = (): void => {
  clearAuth();
  deleteUserData();
};

// Fonction pour créer les headers avec token
const createHeaders = (isFormData: boolean = false): Record<string, string> => {
  const headers: Record<string, string> = {
    'accept': 'application/json'
  };

  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }

  const accessToken = getAccessToken();
  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  return headers;
};

// Fonction pour gérer le refresh token
const refreshAccessToken = async (): Promise<string> => {
  const refreshToken = getRefreshToken();
  
  if (!refreshToken) {
    throw new Error('No refresh token available');
  }

  const response = await fetch(`${API_URL}/authentication/token/refresh/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'accept': 'application/json'
    },
    body: JSON.stringify({ refresh: refreshToken })
  });

  if (!response.ok) {
    throw new Error('Failed to refresh token');
  }

  const data = await response.json();
  setAccessToken(data.access);
  setRefreshToken(data.refresh);
  
  return data.access;
};

// Fonction principale pour les requêtes API
const apiRequest = async (config: {
  url: string;
  method?: string;
  data?: any;
  isFormData?: boolean;
  navigate?: (path: string) => void;
}): Promise<Response> => {
  const { url, method = 'GET', data, isFormData = false, navigate } = config;
  
  const makeRequest = async (token?: string): Promise<Response> => {
    const headers: Record<string, string> = createHeaders(isFormData);
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const requestConfig: RequestInit = {
      method,
      headers,
    };

    if (data) {
      if (isFormData) {
        requestConfig.body = data; // FormData object
      } else {
        requestConfig.body = JSON.stringify(data);
      }
    }

    return fetch(`${API_URL}${url.startsWith('/') ? url : `/${url}`}`, requestConfig);
  };

  try {
    let response = await makeRequest();

    // Gérer le cas 401 (token expiré)
    if (response.status === 401) {
      try {
        const newToken = await refreshAccessToken();
        response = await makeRequest(newToken);
      } catch (refreshError) {
        clearAllUserData();
        if (navigate) {
          navigate('/login');
        }
        throw refreshError;
      }
    }

    return response;
  } catch (error) {
    if (navigate && (error as any)?.message?.includes('refresh')) {
      clearAllUserData();
      navigate('/login');
    }
    throw error;
  }
};

// Fonction spécifique pour les requêtes avec FormData
const apiFormDataRequest = async (config: {
  url: string;
  method?: string;
  data?: FormData;
  navigate?: (path: string) => void;
}): Promise<Response> => {
  return apiRequest({ ...config, isFormData: true });
};

// Fonction helper pour gérer les erreurs de réponse
const handleResponseError = async (error: any, navigate?: (path: string) => void) => {
  if (navigate) {
    clearAllUserData();
    navigate('/login');
  }
  throw error;
};

// Fonctions utilitaires pour l'auth
export const authUtils = {
  getAccessToken,
  getRefreshToken,
  setAccessToken,
  setRefreshToken,
  deleteAccessToken,
  deleteRefreshToken,
  clearAuth
};

// Fonctions utilitaires pour les données utilisateur
export const userDataUtils = {
  getUserData,
  setUserData,
  deleteUserData
};

// Fonctions utilitaires générales
export const storageUtils = {
  clearAllUserData
};

// Export des fonctions principales
export { apiRequest, apiFormDataRequest, handleResponseError as handleResponseErrorWithNavigate };

// High-level API service used across pages
// Provides convenience methods that wrap apiRequest and return parsed JSON
// Updated to align with /products/products/ endpoints and support filters
export const apiService = {
  // Helpers
  buildQuery(params: Record<string, any | undefined>): string {
    const qp = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v === undefined || v === null || v === '') return;
      qp.append(k, String(v));
    });
    const s = qp.toString();
    return s ? `?${s}` : '';
  },

  // 1) Public products with dynamic filters
  async getPublicProducts(params?: {
    unit_type?: 'kg' | 'unité';
    is_published?: boolean;
    location_commune?: string;
    location_village?: string;
    producer?: number | string;
    search?: string;
    ordering?: string; // e.g. '-created_at'
  }): Promise<any[]> {
    const query = this.buildQuery(params || {});
    const res = await apiRequest({ url: `/products/products/${query}`, method: 'GET' });
    return res.json();
  },

  // 2) Products for a specific producer
  async getProducerProducts(producerId: number | string, include_unpublished?: boolean): Promise<any[]> {
    const query = this.buildQuery({ include_unpublished });
    const res = await apiRequest({ url: `/products/products/producer/${producerId}/${query}`, method: 'GET' });
    return res.json();
  },

  // 3) Product details
  async getProduct(id: number | string): Promise<any> {
    const res = await apiRequest({ url: `/products/products/${id}/`, method: 'GET' });
    return res.json();
  },
  async getProductById(id: number | string): Promise<any> {
    return this.getProduct(id);
  },

  // 4) Create product
  async createProduct(data: any): Promise<any> {
    const res = await apiRequest({ url: '/products/products/', method: 'POST', data });
    return res.json();
  },

  // 5) Partial update (PATCH)
  async updateProductPartial(id: number | string, data: any): Promise<any> {
    const res = await apiRequest({ url: `/products/products/${id}/`, method: 'PATCH', data });
    return res.json();
  },
  // Backward compatibility (full update)
  async updateProduct(id: number | string, data: any): Promise<any> {
    const res = await apiRequest({ url: `/products/products/${id}/`, method: 'PUT', data });
    return res.json();
  },

  // 6) Delete product
  async deleteProduct(id: number | string): Promise<boolean> {
    const res = await apiRequest({ url: `/products/products/${id}/`, method: 'DELETE' });
    return res.ok;
  },

  // 7) Publish/Unpublish convenience
  async setProductPublished(id: number | string, is_published: boolean): Promise<any> {
    const res = await apiRequest({ url: `/products/products/${id}/`, method: 'PATCH', data: { is_published } });
    return res.json();
  },

  // Existing stubs kept as-is
  async getOrders(): Promise<any[]> {
    const res = await apiRequest({ url: '/orders/', method: 'GET' });
    return res.json();
  },
  async getOrdersByUser(userId: string): Promise<any[]> {
    const orders = await this.getOrders();
    return orders.filter((o: any) => String(o.userId) === String(userId));
  },
  async updateOrder(id: number, data: any): Promise<any> {
    const res = await apiRequest({ url: `/orders/${id}/`, method: 'PUT', data });
    return res.json();
  },
  async createOrder(data: any): Promise<any> {
    const res = await apiRequest({ url: '/orders/', method: 'POST', data });
    return res.json();
  },

  async getUsers(): Promise<any[]> {
    const res = await apiRequest({ url: '/users/', method: 'GET' });
    return res.json();
  }
  ,
  // --- Commerce (Cart & Orders) ---
  async getCart(navigate?: (path: string) => void): Promise<{ items: any[]; total: number }> {
    const res = await apiRequest({ url: '/commerce/cart/', method: 'GET', navigate });
    return res.json();
  },
  async addCartItem(product_id: number, quantity: number | string, navigate?: (path: string) => void): Promise<{ items: any[]; total: number }> {
    const res = await apiRequest({ url: '/commerce/cart/add-item/', method: 'POST', data: { product_id, quantity }, navigate });
    return res.json();
  },
  async removeCartItem(item_id: number, navigate?: (path: string) => void): Promise<{ items: any[]; total: number }> {
    const res = await apiRequest({ url: '/commerce/cart/remove-item/', method: 'POST', data: { item_id }, navigate });
    return res.json();
  },
  async clearCart(navigate?: (path: string) => void): Promise<{ items: any[]; total: number }> {
    const res = await apiRequest({ url: '/commerce/cart/clear/', method: 'POST', navigate });
    return res.json();
  },
  async checkoutCart(data?: { shipping_address?: string }, navigate?: (path: string) => void): Promise<any[]> {
    const res = await apiRequest({ url: '/commerce/cart/checkout/', method: 'POST', data, navigate });
    return res.json();
  },
  async getCommerceOrders(navigate?: (path: string) => void): Promise<any[]> {
    const res = await apiRequest({ url: '/commerce/orders/', method: 'GET', navigate });
    return res.json();
  },
  async getCommerceOrder(id: number | string, navigate?: (path: string) => void): Promise<any> {
    const res = await apiRequest({ url: `/commerce/orders/${id}/`, method: 'GET', navigate });
    return res.json();
  },
  async getVendorOrders(navigate?: (path: string) => void): Promise<any[]> {
    const res = await apiRequest({ url: '/commerce/orders/vendor/', method: 'GET', navigate });
    return res.json();
  }
  ,
  async getVendorStats(params?: { start?: string; end?: string }, navigate?: (path: string) => void): Promise<any> {
    const query = apiService.buildQuery(params || {});
    const res = await apiRequest({ url: `/commerce/orders/vendor-stats/${query}`, method: 'GET', navigate });
    return res.json();
  }
};