export const BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://thomsonbe-new.onrender.com/api";
// export const BASE_URL = "http://127.0.0.1:8000/api";
const cache = new Map();
const CACHE_TTL = 60 * 1000; // 60 seconds

export const api = {
  getHeaders: () => {
    const token = localStorage.getItem('token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  },

  get: async (endpoint, useCache = true) => {
    try {
      if (useCache && cache.has(endpoint)) {
        const cached = cache.get(endpoint);
        if (Date.now() - cached.timestamp < CACHE_TTL) {
          return cached.data;
        } else {
          cache.delete(endpoint);
        }
      }

      const response = await fetch(`${BASE_URL}${endpoint}`, {
        headers: {
          ...api.getHeaders()
        }
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      if (useCache) {
        cache.set(endpoint, { data, timestamp: Date.now() });
      }

      return data;
    } catch (error) {
      console.error("API GET Error:", error);
      throw error;
    }
  },

  post: async (endpoint, body) => {
    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...api.getHeaders()
        },
        body: JSON.stringify(body),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }
      
      // Invalidate cache on mutation
      cache.clear();
      
      return data;
    } catch (error) {
      console.error("API POST Error:", error);
      throw error;
    }
  },

  put: async (endpoint, body) => {
    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...api.getHeaders()
        },
        body: JSON.stringify(body),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }
      
      // Invalidate cache on mutation
      cache.clear();
      
      return data;
    } catch (error) {
      console.error("API PUT Error:", error);
      throw error;
    }
  },

  delete: async (endpoint) => {
    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: "DELETE",
        headers: {
          ...api.getHeaders()
        }
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }
      
      // Invalidate cache on mutation
      cache.clear();
      
      return data;
    } catch (error) {
      console.error("API DELETE Error:", error);
      throw error;
    }
  },
};
