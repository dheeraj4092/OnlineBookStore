import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuthStore } from "@/stores/authStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
});

type FormValues = z.infer<typeof formSchema>;

const ResetPassword = () => {
  const { resetPassword, isLoading, error } = useAuthStore();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      await resetPassword(data.email);
      setIsSuccess(true);
      toast({
        title: "Success",
        description: "Password reset instructions have been sent to your email.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send reset instructions. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow container py-12">
        <div className="max-w-md mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-center">Reset Password</h1>
          
          <div className="border rounded-lg p-6">
            {isSuccess ? (
              <div className="text-center space-y-4">
                <p className="text-green-600">
                  Password reset instructions have been sent to your email.
                </p>
                <p className="text-sm text-muted-foreground">
                  Please check your email for further instructions.
                </p>
                <Button asChild className="w-full bg-storybook-purple hover:bg-storybook-dark-purple">
                  <Link to="/signin">Return to Sign In</Link>
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                
                {error && (
                  <p className="text-red-500 text-sm text-center">{error}</p>
                )}
                
                <div className="pt-4">
                  <Button
                    type="submit"
                    className="w-full bg-storybook-purple hover:bg-storybook-dark-purple"
                    disabled={isSubmitting || isLoading}
                  >
                    {isSubmitting || isLoading ? "Sending..." : "Send Reset Instructions"}
                  </Button>
                </div>
              </form>
            )}
            
            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Remember your password?{" "}
                <Link to="/signin" className="text-storybook-purple hover:underline">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ResetPassword; 