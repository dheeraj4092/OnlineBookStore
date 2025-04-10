import { useState, useEffect } from "react";
import { useOrderStore } from "@/stores/orderStore";
import { format } from "date-fns";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Badge } from "@/components/ui/badge";
import { Order } from "@/stores/orderStore";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

const Orders = () => {
  const { getOrders, orders: storeOrders, loading: storeLoading, error: storeError } = useOrderStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      await getOrders();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [getOrders]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-purple-100 text-purple-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading || storeLoading) {
    return (
      <ProtectedRoute>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow container py-12">
            <div className="text-center py-12">
              <p className="text-xl text-muted-foreground">Loading orders...</p>
            </div>
          </main>
          <Footer />
        </div>
      </ProtectedRoute>
    );
  }

  if (error || storeError) {
    return (
      <ProtectedRoute>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow container py-12">
            <div className="text-center py-12">
              <p className="text-xl text-red-600">{error || storeError}</p>
            </div>
          </main>
          <Footer />
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow container py-12">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">My Orders</h1>
            <Button 
              onClick={fetchOrders} 
              variant="outline" 
              size="sm"
              className="flex items-center gap-2"
              disabled={loading || storeLoading}
            >
              <RefreshCw className={`h-4 w-4 ${loading || storeLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
          
          {!storeOrders || storeOrders.length === 0 ? (
            <div className="text-center py-12 border rounded-lg">
              <p className="text-xl text-muted-foreground mb-6">You haven't placed any orders yet</p>
            </div>
          ) : (
            <div className="space-y-6">
              {storeOrders.map((order) => (
                <div key={order.id} className="border rounded-lg overflow-hidden">
                  <div className="bg-muted p-4 flex justify-between items-center">
                    <div>
                      <p className="font-medium">Order #{order.id?.split('-')[1]}</p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(order.created_at || ""), "MMMM d, yyyy")}
                      </p>
                    </div>
                    <Badge className={getStatusColor(order.status)}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </Badge>
                  </div>
                  
                  <div className="p-4">
                    <div className="space-y-4">
                      {order.items?.map((item) => (
                        <div key={item.id} className="flex justify-between items-center">
                          <div className="flex items-center space-x-4">
                            <img
                              src={item.image_url}
                              alt={item.title}
                              className="w-16 h-16 object-cover rounded"
                            />
                            <div>
                              <h3 className="font-medium">{item.title}</h3>
                              <p className="text-sm text-muted-foreground">
                                Qty: {item.quantity}
                              </p>
                            </div>
                          </div>
                          <p className="font-medium">₹{(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-4 pt-4 border-t">
                      <div className="flex justify-between font-semibold">
                        <span>Total</span>
                        <span>₹{order.total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
        <Footer />
      </div>
    </ProtectedRoute>
  );
};

export default Orders; 