import { useState } from "react";
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
import ProtectedRoute from "@/components/ProtectedRoute";

const formSchema = z.object({
  username: z.string().min(2, "Username must be at least 2 characters").optional(),
  avatar_url: z.string().url("Must be a valid URL").optional().or(z.literal("")),
});

type FormValues = z.infer<typeof formSchema>;

const Profile = () => {
  const { user, updateProfile, isLoading } = useAuthStore();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: user?.user_metadata?.username || "",
      avatar_url: user?.user_metadata?.avatar_url || "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      await updateProfile(data);
      toast({
        title: "Success",
        description: "Your profile has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow container py-12">
          <div className="max-w-md mx-auto">
            <h1 className="text-3xl font-bold mb-8 text-center">Your Profile</h1>
            
            <div className="border rounded-lg p-6">
              <div className="mb-6 text-center">
                <div className="w-24 h-24 mx-auto rounded-full bg-muted flex items-center justify-center overflow-hidden">
                  {user?.user_metadata?.avatar_url ? (
                    <img
                      src={user.user_metadata.avatar_url}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-4xl text-muted-foreground">
                      {user?.email?.[0].toUpperCase()}
                    </span>
                  )}
                </div>
                <p className="mt-2 font-medium">{user?.email}</p>
              </div>
              
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="username">Username (Optional)</Label>
                  <Input
                    id="username"
                    {...register("username")}
                    className={errors.username ? "border-red-500" : ""}
                  />
                  {errors.username && (
                    <p className="text-red-500 text-sm">{errors.username.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="avatar_url">Avatar URL (Optional)</Label>
                  <Input
                    id="avatar_url"
                    {...register("avatar_url")}
                    className={errors.avatar_url ? "border-red-500" : ""}
                  />
                  {errors.avatar_url && (
                    <p className="text-red-500 text-sm">{errors.avatar_url.message}</p>
                  )}
                </div>
                
                <div className="pt-4">
                  <Button
                    type="submit"
                    className="w-full bg-storybook-purple hover:bg-storybook-dark-purple"
                    disabled={isSubmitting || isLoading}
                  >
                    {isSubmitting || isLoading ? "Updating..." : "Update Profile"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </ProtectedRoute>
  );
};

export default Profile; 