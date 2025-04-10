import { useParams, Link, Navigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useOrderStore } from "@/stores/orderStore";
import WhatsAppButton from "@/components/WhatsAppButton";
import { CheckCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { Order } from "@/stores/orderStore";
import { useNavigate } from "react-router-dom";

const OrderConfirmation = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { getOrder } = useOrderStore();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) return;
      
      try {
        setLoading(true);
        const orderData = await getOrder(orderId);
        setOrder(orderData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch order");
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrder();
  }, [orderId, getOrder]);
  
  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow container py-12">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold mb-4">Loading Order...</h1>
            <p className="text-muted-foreground mb-8">Please wait while we fetch your order details.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow container py-12">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold mb-4">Error Loading Order</h1>
            <p className="text-muted-foreground mb-8">{error}</p>
            <Button asChild>
              <Link to="/">Return to Home</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  if (!order) {
    return <Navigate to="/" />;
  }

  const formatMessage = () => {
    const itemsList = order.items
      .map(item => `- ${item.title} (Qty: ${item.quantity})`)
      .join('\n');
    
    return `Hello! I have placed an order with the following details:

Order ID: ${order.id}
Total Amount: ₹${order.total.toFixed(2)}

Items:
${itemsList}

Please confirm the payment details and any customization requirements.`;
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow container py-12">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Thank You for Your Order!</h1>
            <p className="text-lg text-muted-foreground">
              Your order has been received and is being processed.
            </p>
          </div>
          
          <div className="bg-muted rounded-lg p-6 mb-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-sm text-muted-foreground">Order ID</p>
                <p className="font-medium">{order.id ? order.id.slice(-8) : 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Date</p>
                <p className="font-medium">
                  {order.created_at ? new Date(order.created_at).toLocaleDateString() : 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="font-medium">₹{order.total.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <p className="font-medium capitalize">{order.status}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg border mb-6">
            <div className="p-4 border-b">
              <h2 className="font-semibold">Order Details</h2>
            </div>
            
            <div className="divide-y">
              {order.items && order.items.length > 0 ? (
                order.items.map((item) => (
                  <div key={item.id} className="p-4 flex items-center justify-between">
                    <div className="flex items-center">
                      <img
                        src={item.image_url}
                        alt={item.title}
                        className="w-16 h-16 object-cover rounded mr-4"
                      />
                      <div>
                        <h3 className="font-medium">{item.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          Qty: {item.quantity} × ₹{item.price.toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <div className="font-medium">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-muted-foreground">
                  No items found in this order
                </div>
              )}
            </div>
            
            <div className="p-4 border-t bg-muted">
              <div className="flex justify-between mb-2">
                <span>Subtotal</span>
                <span>₹{order.total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground mb-2">
                <span>Shipping</span>
                <span>To be calculated</span>
              </div>
              <div className="flex justify-between font-bold pt-2 border-t">
                <span>Total</span>
                <span>₹{order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg border mb-8">
            <div className="p-4 border-b">
              <h2 className="font-semibold">Shipping Information</h2>
            </div>
            <div className="p-4">
              <p className="font-medium">{order.shipping_details.firstName} {order.shipping_details.lastName}</p>
              <p>{order.shipping_details.address}</p>
              <p>
                {order.shipping_details.city}, {order.shipping_details.state} {order.shipping_details.zipCode}
              </p>
              <p>{order.shipping_details.country}</p>
              <p className="mt-2">
                <span className="text-muted-foreground">Email: </span>
                {order.shipping_details.email}
              </p>
              <p>
                <span className="text-muted-foreground">Phone: </span>
                {order.shipping_details.phone}
              </p>
              {order.shipping_details.notes && (
                <div className="mt-4 border-t pt-4">
                  <p className="text-muted-foreground mb-1">Notes:</p>
                  <p>{order.shipping_details.notes}</p>
                </div>
              )}
            </div>
          </div>
          
          <div className="text-center">
            <div className="bg-storybook-light-purple rounded-lg p-6 mb-8 border border-storybook-purple">
              <h2 className="text-2xl font-bold mb-4">Complete Your Order</h2>
              <p className="text-lg mb-6">
                Please click the WhatsApp button below to send your order details. We'll confirm your payment and discuss any customization requirements.
              </p>
              <div className="flex flex-col items-center">
                <WhatsAppButton
                  message={formatMessage()}
                  size="lg"
                  className="w-full justify-center"
                />
              </div>
            </div>
            <Button asChild variant="outline" className="mt-4">
              <Link to="/">Continue Shopping</Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default OrderConfirmation;
