import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { products, orders, users } from '@/lib/db';

export default function TestConnection() {
  const [status, setStatus] = useState<{
    connection: boolean;
    products: boolean;
    orders: boolean;
    users: boolean;
    error?: string;
  }>({
    connection: false,
    products: false,
    orders: false,
    users: false
  });

  useEffect(() => {
    testConnection();
  }, []);

  const testConnection = async () => {
    try {
      // Test 1: Check basic connection
      const { data: authData, error: authError } = await supabase.auth.getSession();
      if (authError) throw new Error(`Connection error: ${authError.message}`);
      setStatus(prev => ({ ...prev, connection: true }));

      // Test 2: Check products table
      try {
        await products.getAll();
        setStatus(prev => ({ ...prev, products: true }));
      } catch (error) {
        console.error('Products test failed:', error);
      }

      // Test 3: Check orders table
      try {
        const { data: ordersData, error: ordersError } = await supabase
          .from('orders')
          .select('id')
          .limit(1);
        if (ordersError) throw ordersError;
        setStatus(prev => ({ ...prev, orders: true }));
      } catch (error) {
        console.error('Orders test failed:', error);
      }

      // Test 4: Check users table
      try {
        const { data: usersData, error: usersError } = await supabase
          .from('users')
          .select('id')
          .limit(1);
        if (usersError) throw usersError;
        setStatus(prev => ({ ...prev, users: true }));
      } catch (error) {
        console.error('Users test failed:', error);
      }

    } catch (err) {
      setStatus(prev => ({
        ...prev,
        error: err instanceof Error ? err.message : String(err)
      }));
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Database Connection Test
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Main Website (Port 8080)
          </p>
          <div className="mt-8 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Basic Connection</span>
              <span className={`text-sm ${status.connection ? 'text-green-600' : 'text-red-600'}`}>
                {status.connection ? '✓ Connected' : '✗ Failed'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Products Table</span>
              <span className={`text-sm ${status.products ? 'text-green-600' : 'text-red-600'}`}>
                {status.products ? '✓ Accessible' : '✗ Failed'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Orders Table</span>
              <span className={`text-sm ${status.orders ? 'text-green-600' : 'text-red-600'}`}>
                {status.orders ? '✓ Accessible' : '✗ Failed'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Users Table</span>
              <span className={`text-sm ${status.users ? 'text-green-600' : 'text-red-600'}`}>
                {status.users ? '✓ Accessible' : '✗ Failed'}
              </span>
            </div>
          </div>
          {status.error && (
            <div className="mt-4 p-4 bg-red-50 rounded-md">
              <p className="text-sm text-red-700">{status.error}</p>
            </div>
          )}
          <div className="mt-4 p-4 bg-gray-50 rounded-md">
            <p className="text-xs text-gray-500">URL: {import.meta.env.VITE_SUPABASE_URL}</p>
            <p className="text-xs text-gray-500">
              Key: {import.meta.env.VITE_SUPABASE_ANON_KEY?.substring(0, 10)}...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 