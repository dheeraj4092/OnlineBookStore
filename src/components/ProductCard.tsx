import { Link } from "react-router-dom";
import { Product } from "@/lib/supabase";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/stores/cartStore";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useCartStore();
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);

  const incrementQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleAddToCart = () => {
    addToCart({
      ...product,
      quantity
    });
    toast({
      title: "Added to cart",
      description: `${product.title} (${quantity}) has been added to your cart.`
    });
    // Reset quantity after adding to cart
    setQuantity(1);
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <Link to={`/product/${product.id}`} className="block">
        <div className="aspect-square relative group">
          <img
            src={product.image_url}
            alt={product.title}
            className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
        </div>
      </Link>
      <CardContent className="p-4 sm:p-6">
        <Link to={`/product/${product.id}`}>
          <h3 className="font-semibold text-base sm:text-lg mb-2 hover:text-storybook-purple transition-colors line-clamp-2">
            {product.title}
          </h3>
        </Link>
        <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
          {product.description}
        </p>
        <p className="font-bold text-lg mb-4">₹{product.price.toFixed(2)}</p>
        
        {/* Quantity Controls */}
        <div className="flex items-center justify-center space-x-4 mb-4">
          <Button
            variant="outline"
            size="icon"
            onClick={decrementQuantity}
            className="w-8 h-8"
          >
            -
          </Button>
          <span className="text-lg font-semibold w-8 text-center">
            {quantity}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={incrementQuantity}
            className="w-8 h-8"
          >
            +
          </Button>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 sm:p-6 sm:pt-0">
        <Button
          onClick={handleAddToCart}
          className="w-full bg-storybook-purple hover:bg-storybook-dark-purple active:scale-95 transition-transform duration-200 text-base py-6 sm:py-7"
        >
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
