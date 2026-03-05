import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authAPI } from '../services/api';

export const useAuthStore = create(
    persist(
        (set) => ({
            user: null,
            token: null,
            refreshToken: null,
            loading: false,
            error: null,

            setAuth: (user, token, refreshToken) => set({ user, token, refreshToken }),

            checkAuth: async () => {
                // Simplified checks or refresh token logic can go here
                // For now, persist middleware handles reloading state
            },

            login: async (email, password) => {
                set({ loading: true, error: null });
                try {
                    const response = await authAPI.login({ email, password });
                    const { user, token, refreshToken } = response.data.data;
                    set({ user, token, refreshToken, loading: false });
                    return user;
                } catch (error) {
                    set({ loading: false, error: error.response?.data?.message || 'Login failed' });
                    throw error;
                }
            },

            register: async (userData) => {
                set({ loading: true, error: null });
                try {
                    const response = await authAPI.register(userData);
                    const { user, token, refreshToken } = response.data.data;
                    set({ user, token, refreshToken, loading: false });
                    return user;
                } catch (error) {
                    set({ loading: false, error: error.response?.data?.message || 'Registration failed' });
                    throw error;
                }
            },

            updateUser: (userData) => set((state) => ({ user: { ...state.user, ...userData } })),

            logout: async () => {
                try {
                    // Optional: Call logout API if needed
                    // await authAPI.logout(get().refreshToken);
                } catch (err) {
                    console.error('Logout failed', err);
                } finally {
                    set({ user: null, token: null, refreshToken: null });
                }
            },
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({
                user: state.user,
                token: state.token,
                refreshToken: state.refreshToken
            }), // Only persist these
        }
    )
);
