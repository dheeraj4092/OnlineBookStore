
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <section className="pt-12 pb-20 hero-gradient">
      <div className="container px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div className="flex flex-col space-y-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter">
              Create Magical Stories with Your Child as the Hero
            </h1>
            <p className="text-xl text-muted-foreground max-w-[600px]">
              Personalized books, engaging stories, and beautiful posters that spark imagination and create lasting memories.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <Button asChild className="bg-storybook-purple hover:bg-storybook-dark-purple text-white">
                <Link to="/category/customized-book">Shop Custom Books</Link>
              </Button>
              <Button asChild variant="outline" className="border-storybook-purple text-storybook-purple hover:bg-storybook-light-purple">
                <Link to="/about">About Us</Link>
              </Button>
            </div>
          </div>
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-storybook-light-orange rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float"></div>
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-storybook-light-purple rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float animation-delay-2000"></div>
              <img
                src="/placeholder.svg"
                alt="Storybook Preview"
                className="relative z-10 rounded-lg shadow-lg max-w-[450px] w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
