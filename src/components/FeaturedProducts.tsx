import { useEffect, useState } from "react";
import { db, Product } from "@/lib/supabase";
import ProductCard from "./ProductCard";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const FeaturedProducts = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setLoading(true);
        // First try to get featured products
        const data = await db.products.getAll();
        // If no featured products, show the first 4 products
        const featured = data.filter(p => p.featured).slice(0, 4);
        setFeaturedProducts(featured.length > 0 ? featured : data.slice(0, 4));
      } catch (err) {
        setError("Failed to load featured products");
        console.error("Error fetching featured products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  return (
    <section className="py-12">
      <div className="container">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Featured Products</h2>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Button asChild variant="outline" className="border-storybook-purple text-storybook-purple hover:bg-storybook-light-purple">
              <Link to="/category/customized-book">Custom Books</Link>
            </Button>
            <Button asChild variant="outline" className="border-storybook-purple text-storybook-purple hover:bg-storybook-light-purple">
              <Link to="/category/regular-book">Regular Books</Link>
            </Button>
            <Button asChild variant="outline" className="border-storybook-purple text-storybook-purple hover:bg-storybook-light-purple">
              <Link to="/category/poster">Posters</Link>
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-xl text-muted-foreground">Loading featured products...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-xl text-red-500">{error}</p>
          </div>
        ) : featuredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-xl text-muted-foreground">No products available.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedProducts;
