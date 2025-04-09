import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCartStore } from "@/stores/cartStore";
import { useOrderStore, ShippingDetails } from "@/stores/orderStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export function Checkout() {
  const navigate = useNavigate();
  const { items, total, clearCart } = useCartStore();
  const { createOrder, loading, error } = useOrderStore();
  const [shippingDetails, setShippingDetails] = useState<ShippingDetails>({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    phone: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Create the order in the database
      const orderId = await createOrder({
        items,
        shipping_details: shippingDetails,
        total,
        status: "pending",
      });

      // Clear the cart
      clearCart();

      // Show success message
      toast.success("Order placed successfully!");

      // Navigate to order confirmation page
      navigate(`/order-confirmation/${orderId}`);
    } catch (error) {
      toast.error("Failed to place order. Please try again.");
      console.error("Order creation error:", error);
    }
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <Button onClick={() => navigate("/products")}>Continue Shopping</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h2 className="text-2xl font-bold mb-8">Checkout</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-xl font-semibold mb-6">Shipping Information</h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-sm font-medium">First Name</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={shippingDetails.firstName}
                  onChange={handleInputChange}
                  required
                  className="h-12 text-base"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-sm font-medium">Last Name</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={shippingDetails.lastName}
                  onChange={handleInputChange}
                  required
                  className="h-12 text-base"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={shippingDetails.email}
                onChange={handleInputChange}
                required
                className="h-12 text-base"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium">Phone</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={shippingDetails.phone}
                onChange={handleInputChange}
                required
                className="h-12 text-base"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address" className="text-sm font-medium">Address</Label>
              <Input
                id="address"
                name="address"
                value={shippingDetails.address}
                onChange={handleInputChange}
                required
                className="h-12 text-base"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city" className="text-sm font-medium">City</Label>
                <Input
                  id="city"
                  name="city"
                  value={shippingDetails.city}
                  onChange={handleInputChange}
                  required
                  className="h-12 text-base"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state" className="text-sm font-medium">State</Label>
                <Input
                  id="state"
                  name="state"
                  value={shippingDetails.state}
                  onChange={handleInputChange}
                  required
                  className="h-12 text-base"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="zipCode" className="text-sm font-medium">ZIP Code</Label>
                <Input
                  id="zipCode"
                  name="zipCode"
                  value={shippingDetails.zipCode}
                  onChange={handleInputChange}
                  required
                  className="h-12 text-base"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country" className="text-sm font-medium">Country</Label>
                <Input
                  id="country"
                  name="country"
                  value={shippingDetails.country}
                  onChange={handleInputChange}
                  required
                  className="h-12 text-base"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-14 text-lg font-medium"
              disabled={loading}
            >
              {loading ? "Processing..." : "Place Order"}
            </Button>

            {error && (
              <p className="text-red-500 text-sm mt-2">{error}</p>
            )}
          </form>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-xl font-semibold mb-6">Order Summary</h3>
          <div className="space-y-6">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between items-start py-4 border-b">
                <div className="flex-1 pr-4">
                  <p className="font-medium text-base">{item.title}</p>
                  <p className="text-sm text-gray-500 mt-1">Quantity: {item.quantity}</p>
                </div>
                <p className="font-medium text-base whitespace-nowrap">${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
            <div className="border-t pt-6">
              <div className="flex justify-between items-center">
                <p className="font-bold text-lg">Total</p>
                <p className="font-bold text-lg">${total.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 