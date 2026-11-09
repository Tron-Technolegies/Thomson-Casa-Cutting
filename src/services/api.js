export const BASE_URL = (
  import.meta.env.VITE_API_BASE_URL ||
  "https://thomsonbe-new.onrender.com/api"
).replace(/\/+$/, "");

// export const BASE_URL = "http://127.0.0.1:8000/api";

const cache = new Map();
const CACHE_TTL = 60 * 1000;

const buildURL = (endpoint) =>
  `${BASE_URL}/${String(endpoint).replace(/^\/+/, "")}`;

const getErrorMessage = (data, status) => {
  const detail = data?.detail ?? data?.message ?? data?.error;

  if (typeof detail === "string" && detail.trim()) {
    return detail;
  }

  if (detail !== undefined && detail !== null) {
    return typeof detail === "object"
      ? JSON.stringify(detail)
      : String(detail);
  }

  return `Request failed with status ${status}`;
};

const handleResponse = async (response) => {
  const responseText = await response.text();

  let data = null;

  if (responseText) {
    try {
      data = JSON.parse(responseText);
    } catch {
      data = { detail: responseText };
    }
  }

  if (!response.ok) {
    const error = new Error(
      getErrorMessage(data, response.status)
    );

    error.status = response.status;
    error.data = data;

    throw error;
  }

  return data;
};

const getHeaders = () => {
  const token = localStorage.getItem("token");

  return token
    ? { Authorization: `Bearer ${token}` }
    : {};
};

export const api = {
  getHeaders,

  clearCache: () => {
    cache.clear();
  },

  get: async (endpoint, useCache = true) => {
    try {
      const token = localStorage.getItem("token") || "anonymous";
      const cacheKey = `${token}:${endpoint}`;

      if (useCache && cache.has(cacheKey)) {
        const cached = cache.get(cacheKey);

        if (Date.now() - cached.timestamp < CACHE_TTL) {
          return cached.data;
        }

        cache.delete(cacheKey);
      }

      const response = await fetch(buildURL(endpoint), {
        method: "GET",
        headers: {
          ...getHeaders(),
        },
      });

      const data = await handleResponse(response);

      if (useCache) {
        cache.set(cacheKey, {
          data,
          timestamp: Date.now(),
        });
      }

      return data;
    } catch (error) {
      console.error("API GET Error:", error);
      throw error;
    }
  },

  post: async (endpoint, body) => {
    try {
      const response = await fetch(buildURL(endpoint), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getHeaders(),
        },
        body: JSON.stringify(body),
      });

      const data = await handleResponse(response);

      cache.clear();

      return data;
    } catch (error) {
      console.error("API POST Error:", error);
      throw error;
    }
  },

  put: async (endpoint, body) => {
    try {
      const response = await fetch(buildURL(endpoint), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...getHeaders(),
        },
        body: JSON.stringify(body),
      });

      const data = await handleResponse(response);

      cache.clear();

      return data;
    } catch (error) {
      console.error("API PUT Error:", error);
      throw error;
    }
  },

  delete: async (endpoint) => {
    try {
      const response = await fetch(buildURL(endpoint), {
        method: "DELETE",
        headers: {
          ...getHeaders(),
        },
      });

      const data = await handleResponse(response);

      cache.clear();

      return data;
    } catch (error) {
      console.error("API DELETE Error:", error);
      throw error;
    }
  },
};