import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { db, Product } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import WhatsAppButton from "@/components/WhatsAppButton";

const categoryTitles: Record<string, string> = {
  "customized-book": "Customized Books",
  "regular-book": "Regular Books",
  "poster": "Posters"
};

const categoryDescriptions: Record<string, string> = {
  "customized-book": "Create a unique story where your child is the main character.",
  "regular-book": "Explore our collection of beautifully illustrated children's books.",
  "poster": "Decorate your child's room with our vibrant and educational posters."
};

const CategoryPage = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await db.products.getByCategory(categoryId || "");
        setProducts(data);
      } catch (err) {
        setError("Failed to load products");
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryId]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <div className="container py-12">
          <h1 className="text-4xl font-bold mb-4">
            {categoryTitles[categoryId as keyof typeof categoryTitles] || "Products"}
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            {categoryDescriptions[categoryId as keyof typeof categoryDescriptions] || "Browse our collection of products."}
          </p>
          
          {loading ? (
            <div className="text-center py-12">
              <p className="text-xl text-muted-foreground">Loading products...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-xl text-red-500">{error}</p>
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-xl text-muted-foreground">No products found in this category.</p>
            </div>
          )}
        </div>
      </main>
      <WhatsAppButton />
      <Footer />
    </div>
  );
};

export default CategoryPage;
