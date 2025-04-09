import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '@/lib/supabase';
import type { User, Session } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  error: string | null;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (data: { username?: string; avatar_url?: string }) => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      session: null,
      isLoading: false,
      error: null,

      signUp: async (email: string, password: string) => {
        try {
          set({ isLoading: true, error: null });
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              emailRedirectTo: `${window.location.origin}/auth/callback`,
            },
          });
          
          if (error) {
            set({ error: error.message });
            throw error;
          }
          
          if (!data.user) {
            const error = new Error('No user data returned');
            set({ error: error.message });
            throw error;
          }

          // If email confirmation is disabled, set the user and session immediately
          if (data.session) {
            set({ user: data.user, session: data.session });
          }
          
        } catch (error) {
          set({ error: (error as Error).message });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      signIn: async (email: string, password: string) => {
        try {
          set({ isLoading: true, error: null });
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });
          
          if (error) {
            set({ error: error.message });
            throw error;
          }
          
          if (!data.user) {
            const error = new Error('No user data returned');
            set({ error: error.message });
            throw error;
          }
          
          set({ user: data.user, session: data.session });
        } catch (error) {
          set({ error: (error as Error).message });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      signOut: async () => {
        try {
          set({ isLoading: true, error: null });
          const { error } = await supabase.auth.signOut();
          
          if (error) throw error;
          
          set({ user: null, session: null });
        } catch (error) {
          set({ error: (error as Error).message });
        } finally {
          set({ isLoading: false });
        }
      },

      resetPassword: async (email: string) => {
        try {
          set({ isLoading: true, error: null });
          const { error } = await supabase.auth.resetPasswordForEmail(email);
          
          if (error) throw error;
        } catch (error) {
          set({ error: (error as Error).message });
        } finally {
          set({ isLoading: false });
        }
      },

      updateProfile: async (data) => {
        try {
          set({ isLoading: true, error: null });
          const { error } = await supabase.auth.updateUser({
            data,
          });
          
          if (error) throw error;
          
          // Refresh user data
          const { data: { user } } = await supabase.auth.getUser();
          set({ user });
        } catch (error) {
          set({ error: (error as Error).message });
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: 'auth-storage',
    }
  )
); 