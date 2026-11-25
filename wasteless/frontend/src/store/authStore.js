import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authAPI } from '../services/api';

export const useAuthStore = create(
    persist(
        (set) => ({
            user: null,
            token: null,
            loading: false,
            error: null,

            setAuth: (user, token) => set({ user, token }),

            checkAuth: async () => {
                // Simplified checks or refresh token logic can go here
                // For now, persist middleware handles reloading state
            },

            login: async (email, password) => {
                set({ loading: true, error: null });
                try {
                    const response = await authAPI.login({ email, password });
                    const { user, token } = response.data.data;
                    set({ user, token, loading: false });
                    return user;
                } catch (error) {
                    const data = error.response?.data;
                    const message =
                        data?.error ||
                        (data?.errors?.length ? data.errors.map(e => e.msg).join(', ') : null) ||
                        'Login failed';
                    set({ loading: false, error: message });
                    throw error;
                }
            },

            register: async (userData) => {
                set({ loading: true, error: null });
                try {
                    const response = await authAPI.register(userData);
                    const { user, token } = response.data.data;
                    set({ user, token, loading: false });
                    return user;
                } catch (error) {
                    const data = error.response?.data;
                    // Backend sends either `data.error` (AppError) or `data.errors` (express-validator array)
                    const message =
                        data?.error ||
                        (data?.errors?.length ? data.errors.map(e => e.msg).join(', ') : null) ||
                        'Registration failed';
                    set({ loading: false, error: message });
                    throw error;
                }
            },

            updateUser: (userData) => set((state) => ({ user: { ...state.user, ...userData } })),

            logout: async () => {
                try {
                    await authAPI.logout(); // Triggers backend cookie clearing & DB cleanup
                } catch (err) {
                    console.error('Backend logout cleanup failed', err);
                } finally {
                    // Always clear local state even if network fails
                    set({ user: null, token: null });
                }
            },
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({
                user: state.user,
                token: state.token
            }), // Only persist these
        }
    )
);
