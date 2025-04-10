import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { db, Product } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import WhatsAppButton from "@/components/WhatsAppButton";
import { useCartStore } from "@/stores/cartStore";

const ProductDetail = () => {
  const { productId } = useParams<{ productId: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const { toast } = useToast();
  const { addToCart } = useCartStore();

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) return;
      
      try {
        setLoading(true);
        const data = await db.products.getById(productId);
        setProduct(data);
      } catch (err) {
        setError("Failed to load product");
        console.error("Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const incrementQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    
    addToCart({
      ...product,
      quantity
    });
    toast({
      title: "Added to cart",
      description: `${product.title} (${quantity}) has been added to your cart.`
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow container py-12">
          <div className="text-center py-12">
            <p className="text-xl text-muted-foreground">Loading product...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow container py-12">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
            <p className="text-muted-foreground mb-8">The product you're looking for doesn't exist or has been removed.</p>
            <Button asChild>
              <Link to="/">Return to Home</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <div className="container py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="aspect-square">
              <img
                src={product.image_url}
                alt={product.title}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-4">{product.title}</h1>
              <p className="text-2xl font-bold text-storybook-purple mb-4">
                ₹{product.price.toFixed(2)}
              </p>
              <p className="text-muted-foreground mb-8">{product.description}</p>
              
              <div className="flex items-center space-x-4 mb-8">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={decrementQuantity}
                  className="w-10 h-10"
                >
                  -
                </Button>
                <span className="text-xl font-semibold w-12 text-center">
                  {quantity}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={incrementQuantity}
                  className="w-10 h-10"
                >
                  +
                </Button>
              </div>

              <Button
                onClick={handleAddToCart}
                className="w-full bg-storybook-purple hover:bg-storybook-dark-purple mb-4"
              >
                Add to Cart
              </Button>

              <Button
                variant="outline"
                className="w-full"
                asChild
              >
                <Link to={`/category/${product.category}`}>
                  View More {product.category.replace('-', ' ')}s
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
      <WhatsAppButton />
      <Footer />
    </div>
  );
};

export default ProductDetail;
