import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCartStore } from "@/stores/cartStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { useOrderStore } from "@/stores/orderStore";

const formSchema = z.object({
  fullName: z.string().min(3, "Full name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number is required"),
  address: z.string().min(5, "Address is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  zipCode: z.string().min(4, "ZIP code is required"),
  country: z.string().min(2, "Country is required"),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const CheckoutPage = () => {
  const { items, getTotal, clearCart } = useCartStore();
  const { createOrder } = useOrderStore();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shouldRedirect, setShouldRedirect] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
      notes: "",
    },
  });

  // Handle redirection when cart is empty
  useEffect(() => {
    if (items.length === 0 && !shouldRedirect) {
      setShouldRedirect(true);
    }
  }, [items.length, shouldRedirect]);

  useEffect(() => {
    if (shouldRedirect) {
      navigate("/cart");
    }
  }, [shouldRedirect, navigate]);

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    
    // Create a new order
    try {
      const orderId = await createOrder({
        items: [...items],
        shipping_details: {
          firstName: data.fullName.split(' ')[0] || '',
          lastName: data.fullName.split(' ').slice(1).join(' ') || '',
          email: data.email,
          phone: data.phone,
          address: data.address,
          city: data.city,
          state: data.state,
          zipCode: data.zipCode,
          country: data.country,
          notes: data.notes,
        },
        total: getTotal(),
        status: "pending",
      });
      
      if (!orderId) {
        throw new Error("Failed to create order");
      }
      
      // Clear the cart
      clearCart();
      
      // Show success toast
      toast({
        title: "Order Placed Successfully",
        description: "We'll contact you via WhatsApp to confirm payment and customization details.",
      });
      
      // Redirect to order confirmation
      navigate(`/order-confirmation/${orderId}`);
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error processing your order. Please try again.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };
  
  if (items.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow container py-12">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="border rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
              
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      {...register("fullName")}
                      className={errors.fullName ? "border-red-500" : ""}
                    />
                    {errors.fullName && (
                      <p className="text-red-500 text-sm">{errors.fullName.message}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      {...register("email")}
                      className={errors.email ? "border-red-500" : ""}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm">{errors.email.message}</p>
                    )}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    {...register("phone")}
                    className={errors.phone ? "border-red-500" : ""}
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm">{errors.phone.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    {...register("address")}
                    className={errors.address ? "border-red-500" : ""}
                  />
                  {errors.address && (
                    <p className="text-red-500 text-sm">{errors.address.message}</p>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      {...register("city")}
                      className={errors.city ? "border-red-500" : ""}
                    />
                    {errors.city && (
                      <p className="text-red-500 text-sm">{errors.city.message}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="state">State/Province</Label>
                    <Input
                      id="state"
                      {...register("state")}
                      className={errors.state ? "border-red-500" : ""}
                    />
                    {errors.state && (
                      <p className="text-red-500 text-sm">{errors.state.message}</p>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="zipCode">ZIP/Postal Code</Label>
                    <Input
                      id="zipCode"
                      {...register("zipCode")}
                      className={errors.zipCode ? "border-red-500" : ""}
                    />
                    {errors.zipCode && (
                      <p className="text-red-500 text-sm">{errors.zipCode.message}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      {...register("country")}
                      className={errors.country ? "border-red-500" : ""}
                    />
                    {errors.country && (
                      <p className="text-red-500 text-sm">{errors.country.message}</p>
                    )}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="notes">Order Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    placeholder="Special instructions for your order"
                    {...register("notes")}
                  />
                </div>
                
                <div className="pt-4">
                  <Button
                    type="submit"
                    className="w-full bg-storybook-purple hover:bg-storybook-dark-purple"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Processing..." : "Place Order"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
          
          <div className="lg:col-span-1">
            <div className="border rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between">
                    <div className="flex items-center">
                      <img
                        src={item.image_url}
                        alt={item.title}
                        className="w-12 h-12 object-cover rounded mr-4"
                      />
                      <div>
                        <p className="font-medium">{item.title}</p>
                        <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              
              <div className="border-t pt-4">
                <div className="flex justify-between mb-2">
                  <span>Subtotal</span>
                  <span>${getTotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground mb-2">
                  <span>Shipping</span>
                  <span>Calculated later</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2 border-t">
                  <span>Total</span>
                  <span>${getTotal().toFixed(2)}</span>
                </div>
              </div>
              
              <div className="mt-6">
                <p className="text-sm text-muted-foreground mb-2">
                  By placing an order, you agree to our Terms of Service and Privacy Policy.
                </p>
                <p className="text-sm text-muted-foreground">
                  We'll contact you via WhatsApp to confirm your order, collect payment, and gather any customization details.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CheckoutPage;
