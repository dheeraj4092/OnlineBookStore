import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type Tables = Database['public']['Tables'];

// Product operations
export const products = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as Tables['products']['Row'][];
  },
  
  getById: async (id: string) => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data as Tables['products']['Row'];
  },
  
  getFeatured: async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('featured', true)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as Tables['products']['Row'][];
  }
};

// Order operations
export const orders = {
  create: async (order: Tables['orders']['Insert'], items: Tables['order_items']['Insert'][]) => {
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert([order])
      .select()
      .single();
    
    if (orderError) throw orderError;
    
    const orderItems = items.map(item => ({
      ...item,
      order_id: orderData.id
    }));
    
    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);
    
    if (itemsError) throw itemsError;
    
    return orderData as Tables['orders']['Row'];
  },
  
  getByUserId: async (userId: string) => {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          *,
          products (*)
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as (Tables['orders']['Row'] & {
      order_items: (Tables['order_items']['Row'] & {
        products: Tables['products']['Row']
      })[]
    })[];
  }
};

// User operations
export const users = {
  getProfile: async (userId: string) => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) throw error;
    return data as Tables['users']['Row'];
  },
  
  updateProfile: async (userId: string, profile: Tables['users']['Update']) => {
    const { data, error } = await supabase
      .from('users')
      .update(profile)
      .eq('id', userId)
      .select()
      .single();
    
    if (error) throw error;
    return data as Tables['users']['Row'];
  }
};

// Auth operations
export const auth = {
  getSession: async () => {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data;
  },
  
  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }
}; 