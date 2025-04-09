import { create } from "zustand";
import { supabase } from "@/lib/supabase";
import { CartItem } from "./cartStore";

export interface ShippingDetails {
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
  notes?: string;
}

export interface Order {
  id?: string;
  user_id?: string;
  items: CartItem[];
  shipping_details: ShippingDetails;
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  created_at?: string;
  updated_at?: string;
}

export interface OrderState {
  orders: Order[];
  loading: boolean;
  error: string | null;
  createOrder: (orderData: Omit<Order, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<string | null>;
  getOrder: (orderId: string) => Promise<Order | null>;
  getOrders: () => Promise<void>;
  updateOrderStatus: (orderId: string, status: Order['status']) => Promise<void>;
  getAdminOrders: () => Promise<void>;
}

export const useOrderStore = create<OrderState>()((set, get) => ({
  orders: [],
  loading: false,
  error: null,

  createOrder: async (orderData) => {
    try {
      set({ loading: true, error: null });

      // Get the current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User must be authenticated to create an order");

      // First, ensure the user exists in the users table
      let userId = user.id;
      
      try {
        // Try to get the user from the users table
        const { data: existingUser, error: userError } = await supabase
          .from('users')
          .select('id')
          .filter('id', 'eq', user.id)
          .maybeSingle();
        
        // If user doesn't exist, create them
        if (!existingUser) {
          console.log("User not found in database, creating new user record");
          const { data: newUser, error: createUserError } = await supabase
            .from('users')
            .insert([{
              id: user.id,
              email: user.email,
              first_name: orderData.shipping_details.firstName,
              last_name: orderData.shipping_details.lastName,
              phone: orderData.shipping_details.phone,
              address: orderData.shipping_details.address
            }])
            .select('id')
            .single();
          
          if (createUserError) {
            console.error("Error creating user:", createUserError);
            throw createUserError;
          }
          
          if (newUser) {
            userId = newUser.id;
          }
        }
      } catch (userError) {
        console.error("Error with user operations:", userError);
        // Continue with order creation even if user operations fail
        // The database constraints will handle this
      }

      // Create the order
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert([
          {
            user_id: userId,
            total: orderData.total,
            status: "pending",
          },
        ])
        .select()
        .single();

      if (orderError) {
        console.error("Error creating order:", orderError);
        throw orderError;
      }
      if (!order) throw new Error("Failed to create order");

      // Create shipping details
      const { error: shippingError } = await supabase
        .from("shipping_details")
        .insert([
          {
            order_id: order.id,
            first_name: orderData.shipping_details.firstName,
            last_name: orderData.shipping_details.lastName,
            email: orderData.shipping_details.email,
            phone: orderData.shipping_details.phone,
            address: orderData.shipping_details.address,
            city: orderData.shipping_details.city,
            state: orderData.shipping_details.state,
            zip_code: orderData.shipping_details.zipCode,
            country: orderData.shipping_details.country,
            notes: orderData.shipping_details.notes,
          },
        ]);

      if (shippingError) {
        console.error("Error creating shipping details:", shippingError);
        throw shippingError;
      }

      // Create order items
      const orderItems = orderData.items.map((item) => ({
        order_id: order.id,
        product_id: item.id,
        quantity: item.quantity,
        price: item.price,
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (itemsError) {
        console.error("Error creating order items:", itemsError);
        throw itemsError;
      }

      // Update local state
      set((state) => ({
        orders: [...state.orders, { ...orderData, id: order.id }],
      }));

      return order.id;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to create order";
      console.error("Order creation error:", error);
      set({ error: errorMessage });
      return null;
    } finally {
      set({ loading: false });
    }
  },

  getOrder: async (orderId) => {
    try {
      set({ loading: true, error: null });

      const { data: order, error: orderError } = await supabase
        .from("orders")
        .select(`
          *,
          order_items (
            *,
            products:product_id (*)
          ),
          shipping_details (*)
        `)
        .eq("id", orderId)
        .single();

      if (orderError) {
        console.error("Error fetching order:", orderError);
        throw orderError;
      }
      if (!order) return null;

      console.log("Raw order data:", order);
      console.log("Shipping details from DB:", order.shipping_details);

      // Transform the data to match our Order interface
      const transformedOrder: Order = {
        id: order.id,
        user_id: order.user_id,
        total: order.total,
        status: order.status,
        created_at: order.created_at,
        updated_at: order.updated_at,
        items: order.order_items.map((item: any) => ({
          id: item.products.id,
          title: item.products.title,
          price: item.price,
          quantity: item.quantity,
          image_url: item.products.image_url,
        })),
        shipping_details: order.shipping_details ? {
          firstName: order.shipping_details.first_name || '',
          lastName: order.shipping_details.last_name || '',
          email: order.shipping_details.email || '',
          phone: order.shipping_details.phone || '',
          address: order.shipping_details.address || '',
          city: order.shipping_details.city || '',
          state: order.shipping_details.state || '',
          zipCode: order.shipping_details.zip_code || '',
          country: order.shipping_details.country || '',
          notes: order.shipping_details.notes || '',
        } : {
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          address: '',
          city: '',
          state: '',
          zipCode: '',
          country: '',
          notes: '',
        },
      };

      console.log("Transformed shipping details:", transformedOrder.shipping_details);
      return transformedOrder;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to fetch order";
      console.error("Error in getOrder:", error);
      set({ error: errorMessage });
      return null;
    } finally {
      set({ loading: false });
    }
  },

  getOrders: async () => {
    try {
      set({ loading: true, error: null });

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User must be authenticated to fetch orders");

      // Use a timestamp to prevent caching
      const timestamp = new Date().getTime();
      const { data: orders, error: ordersError } = await supabase
        .from("orders")
        .select(`
          *,
          order_items (
            *,
            products:product_id (*)
          ),
          shipping_details (*)
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .throwOnError();

      if (ordersError) throw ordersError;
      if (!orders) {
        set({ orders: [] });
        return;
      }

      console.log(`Fetched ${orders.length} orders for user ${user.id}`);

      // Transform the data to match our Order interface
      const transformedOrders: Order[] = orders.map((order: any) => ({
        id: order.id,
        user_id: order.user_id,
        total: order.total,
        status: order.status,
        created_at: order.created_at,
        updated_at: order.updated_at,
        items: order.order_items?.map((item: any) => ({
          id: item.products.id,
          title: item.products.title,
          price: item.price,
          quantity: item.quantity,
          image_url: item.products.image_url,
        })) || [],
        shipping_details: order.shipping_details ? {
          firstName: order.shipping_details.first_name,
          lastName: order.shipping_details.last_name,
          email: order.shipping_details.email,
          phone: order.shipping_details.phone,
          address: order.shipping_details.address,
          city: order.shipping_details.city,
          state: order.shipping_details.state,
          zipCode: order.shipping_details.zip_code,
          country: order.shipping_details.country,
          notes: order.shipping_details.notes,
        } : {
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          address: '',
          city: '',
          state: '',
          zipCode: '',
          country: '',
          notes: '',
        },
      }));

      set({ orders: transformedOrders });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to fetch orders";
      console.error("Error fetching orders:", error);
      set({ error: errorMessage, orders: [] });
    } finally {
      set({ loading: false });
    }
  },

  updateOrderStatus: async (orderId: string, status: Order['status']) => {
    try {
      set({ loading: true, error: null });
      console.log(`Updating order ${orderId} status to ${status}`);

      const { error: updateError } = await supabase
        .from('orders')
        .update({ 
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId);

      if (updateError) {
        console.error('Error updating order status:', updateError);
        throw updateError;
      }

      console.log(`Order ${orderId} status updated successfully to ${status}`);

      // Update local state
      set((state) => ({
        orders: state.orders.map(order => 
          order.id === orderId 
            ? { ...order, status, updated_at: new Date().toISOString() } 
            : order
        )
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to update order status";
      console.error('Error in updateOrderStatus:', error);
      set({ error: errorMessage });
      throw error; // Re-throw to allow the caller to handle it
    } finally {
      set({ loading: false });
    }
  },

  getAdminOrders: async () => {
    try {
      set({ loading: true, error: null });

      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select(`
          *,
          users (
            first_name,
            last_name,
            email
          ),
          order_items (
            *,
            products:product_id (*)
          ),
          shipping_details (*)
        `)
        .order('created_at', { ascending: false });

      if (ordersError) throw ordersError;

      // Transform the data to match our Order interface
      const transformedOrders: Order[] = orders.map((order: any) => ({
        id: order.id,
        user_id: order.user_id,
        total: order.total,
        status: order.status,
        created_at: order.created_at,
        updated_at: order.updated_at,
        items: order.order_items.map((item: any) => ({
          id: item.products.id,
          title: item.products.title,
          price: item.price,
          quantity: item.quantity,
          image_url: item.products.image_url,
        })),
        shipping_details: {
          firstName: order.shipping_details.first_name,
          lastName: order.shipping_details.last_name,
          email: order.shipping_details.email,
          phone: order.shipping_details.phone,
          address: order.shipping_details.address,
          city: order.shipping_details.city,
          state: order.shipping_details.state,
          zipCode: order.shipping_details.zip_code,
          country: order.shipping_details.country,
          notes: order.shipping_details.notes,
        },
      }));

      set({ orders: transformedOrders });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to fetch orders";
      set({ error: errorMessage });
    } finally {
      set({ loading: false });
    }
  },
}));
