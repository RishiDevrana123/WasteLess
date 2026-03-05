import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        const token = useAuthStore.getState().token;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor for token refresh
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const { refreshToken } = useAuthStore.getState();
                const response = await axios.post(`${API_URL}/auth/refresh-token`, {
                    refreshToken,
                });

                const { token: newToken, refreshToken: newRefreshToken } = response.data.data;
                useAuthStore.getState().setAuth(
                    useAuthStore.getState().user,
                    newToken,
                    newRefreshToken
                );

                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                return api(originalRequest);
            } catch (refreshError) {
                useAuthStore.getState().logout();
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;

// Auth API
export const authAPI = {
    register: (data) => api.post('/auth/register', data),
    login: (data) => api.post('/auth/login', data),
    logout: (refreshToken) => api.post('/auth/logout', { refreshToken }),
    forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
    resetPassword: (token, password) => api.post(`/auth/reset-password/${token}`, { password }),
};

// User API
export const userAPI = {
    getProfile: () => api.get('/users/profile'),
    updateProfile: (data) => api.put('/users/profile', data),
    uploadAvatar: (data) => api.post('/users/avatar', data),
    changePassword: (data) => api.put('/users/password', data),
    recordCookedRecipe: (data) => api.post('/users/cooked-recipes', data)
};

// Inventory API
export const inventoryAPI = {
    getAll: (params) => api.get('/inventory', { params }),
    getById: (id) => api.get(`/inventory/${id}`),
    create: (data) => api.post('/inventory', data),
    update: (id, data) => api.put(`/inventory/${id}`, data),
    delete: (id) => api.delete(`/inventory/${id}`),
    getExpiring: (days) => api.get('/inventory/expiring', { params: { days } }),
    smartEntry: (data) => api.post('/inventory/smart-entry', data),
};

// Recipe API
export const recipeAPI = {
    getSuggestions: (params) => api.get('/recipes/suggestions', { params }),
    getCustomSuggestions: (data) => api.post('/recipes/custom', data),
};

// AI API
export const aiAPI = {
    getStorageAdvice: (data) => api.post('/ai/storage-advice', data),
};


// Payment API
export const paymentAPI = {
    createDonationOrder: (data) => api.post('/payments/create-donation', data),
    verifyDonation: (data) => api.post('/payments/verify-donation', data),
};

// Notification API
export const notificationAPI = {
    getAll: (params) => api.get('/notifications', { params }),
    markAsRead: (id) => api.put(`/notifications/${id}/read`),
    markAllAsRead: () => api.put('/notifications/read-all'),
    delete: (id) => api.delete(`/notifications/${id}`),
};

// Analytics API
export const analyticsAPI = {
    getDashboard: () => api.get('/analytics/dashboard'),
    getImpact: (params) => api.get('/analytics/impact', { params }),
};

// Shopping API
export const shoppingAPI = {
    addItems: (data) => api.post('/shopping/add', data),
    getAll: () => api.get('/shopping'),
    markAsPurchased: (id) => api.patch(`/shopping/${id}/purchased`),
    clearList: (params) => api.delete('/shopping/clear', { params }),
};
