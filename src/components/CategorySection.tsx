import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";

const categoryDescriptions: Record<string, string> = {
  "customized-book": "Create a unique story where your child is the main character.",
  "regular-book": "Explore our collection of beautifully illustrated children's books.",
  "poster": "Decorate your child's room with our vibrant and educational posters."
};

const categories = [
  {
    id: "customized-book",
    title: "Customized Books",
    description: categoryDescriptions["customized-book"],
    imageUrl: "https://placehold.co/600x400/png?text=Customized+Books"
  },
  {
    id: "regular-book",
    title: "Regular Books",
    description: categoryDescriptions["regular-book"],
    imageUrl: "https://placehold.co/600x400/png?text=Regular+Books"
  },
  {
    id: "poster",
    title: "Posters",
    description: categoryDescriptions["poster"],
    imageUrl: "https://placehold.co/600x400/png?text=Posters"
  }
];

const CategorySection = () => {
  return (
    <section className="py-12">
      <div className="container">
        <h2 className="text-3xl font-bold mb-8">Browse Our Categories</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Link key={category.id} to={`/category/${category.id}`}>
              <Card className="overflow-hidden transition-all hover:shadow-lg">
                <div className="aspect-video relative">
                  <img
                    src={category.imageUrl}
                    alt={category.title}
                    className="object-cover w-full h-full"
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg mb-2">{category.title}</h3>
                  <p className="text-muted-foreground text-sm">{category.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
