import { Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/stores/cartStore";
import { Trash2 } from "lucide-react";
import WhatsAppButton from "@/components/WhatsAppButton";
import { useAuthStore } from "@/stores/authStore";

const CartPage = () => {
  const { items, removeFromCart, updateQuantity, getTotal, clearCart } = useCartStore();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  
  if (items.length === 0) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow container py-12">
          <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
          <div className="text-center py-12 border rounded-lg">
            <p className="text-xl text-muted-foreground mb-6">Your cart is empty</p>
            <Button asChild>
              <Link to="/">Continue Shopping</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const handleCheckout = () => {
    if (!user) {
      // Store the current path to redirect back after login
      sessionStorage.setItem('redirectAfterLogin', '/checkout');
      navigate('/signin');
      return;
    }
    navigate('/checkout');
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow container py-12">
        <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="border rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted">
                    <tr>
                      <th className="text-left p-4">Product</th>
                      <th className="text-center p-4">Price</th>
                      <th className="text-center p-4">Quantity</th>
                      <th className="text-center p-4">Total</th>
                      <th className="text-center p-4">Remove</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item) => (
                      <tr key={item.id} className="border-t">
                        <td className="p-4">
                          <div className="flex items-center space-x-4">
                            <img
                              src={item.image_url}
                              alt={item.title}
                              className="w-16 h-16 object-cover rounded"
                            />
                            <div>
                              <h3 className="font-medium">{item.title}</h3>
                              <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-center">₹{item.price.toFixed(2)}</td>
                        <td className="p-4 text-center">
                          <div className="flex items-center justify-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => item.quantity > 1 && updateQuantity(item.id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                            >
                              -
                            </Button>
                            <span className="w-8 text-center">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              +
                            </Button>
                          </div>
                        </td>
                        <td className="p-4 text-center font-medium">
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </td>
                        <td className="p-4 text-center">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFromCart(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="flex justify-between mt-4">
              <Button variant="outline" onClick={clearCart}>
                Clear Cart
              </Button>
              <Button asChild variant="outline">
                <Link to="/">Continue Shopping</Link>
              </Button>
            </div>
          </div>
          
          <div className="lg:col-span-1">
            <div className="border rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{getTotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Shipping</span>
                  <span>Calculated at checkout</span>
                </div>
              </div>
              
              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>₹{getTotal().toFixed(2)}</span>
                </div>
              </div>
              
              <div className="space-y-4">
                <Button 
                  onClick={handleCheckout}
                  className="w-full bg-storybook-purple hover:bg-storybook-dark-purple"
                >
                  {user ? 'Proceed to Checkout' : 'Sign in to Checkout'}
                </Button>
                <p className="text-sm text-center text-muted-foreground">
                  Payments and customization details will be collected via WhatsApp after checkout.
                </p>
                <WhatsAppButton className="w-full" message={`Hi! I have items in my cart and I'd like to place an order. Total: ₹${getTotal().toFixed(2)}`} />
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CartPage;
