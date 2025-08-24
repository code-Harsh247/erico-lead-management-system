class ApiService {
  constructor() {
    this.baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}/api${endpoint}`;
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: 'include',
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch {
          errorMessage = response.statusText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      const contentType = response.headers.get('content-type');
      const contentLength = response.headers.get('content-length');
      
      if (response.status === 204 || contentLength === '0' || 
          (!contentType || !contentType.includes('application/json'))) {
        return { success: true, status: response.status };
      }

      try {
        const data = await response.json();
        return data;
      } catch (jsonError) {
        console.warn('Failed to parse JSON response:', jsonError);
        return { success: true, status: response.status };
      }

    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  async get(endpoint, options = {}) {
    return this.request(endpoint, {
      method: 'GET',
      ...options,
    });
  }

  async post(endpoint, data = null, options = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : null,
      ...options,
    });
  }

  async put(endpoint, data = null, options = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : null,
      ...options,
    });
  }

  async delete(endpoint, options = {}) {
    return this.request(endpoint, {
      method: 'DELETE',
      ...options,
    });
  }

  async patch(endpoint, data = null, options = {}) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : null,
      ...options,
    });
  }
}

const apiService = new ApiService();
export default apiService;

export const authApi = {
  login: (credentials) => apiService.post('/auth/login', credentials),
  register: (userData) => apiService.post('/auth/register', userData),
  logout: () => apiService.post('/auth/logout'),
  checkAuth: () => apiService.get('/auth/me'),
};

export const leadsApi = {
  getAll: (queryString = '') => apiService.get(`/leads${queryString}`),
  getById: (id) => apiService.get(`/leads/${id}`),
  create: (leadData) => apiService.post('/leads', leadData),
  update: (id, leadData) => apiService.put(`/leads/${id}`, leadData),
  delete: (id) => apiService.delete(`/leads/${id}`),
};

export const usersApi = {
  getProfile: () => apiService.get('/users/profile'),
  updateProfile: (userData) => apiService.put('/users/profile', userData),
  getAll: () => apiService.get('/users'),
};
