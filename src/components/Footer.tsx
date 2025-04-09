
import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-muted py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="flex flex-col space-y-4">
            <h3 className="text-lg font-bold">StoryBook Emporium</h3>
            <p className="text-muted-foreground">
              Bringing imagination to life through personalized books and beautiful posters for children and teenagers.
            </p>
            <div className="flex space-x-4">
              <Link to="#" className="text-foreground hover:text-storybook-purple transition-colors">
                <Facebook size={20} />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link to="#" className="text-foreground hover:text-storybook-purple transition-colors">
                <Instagram size={20} />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link to="#" className="text-foreground hover:text-storybook-purple transition-colors">
                <Twitter size={20} />
                <span className="sr-only">Twitter</span>
              </Link>
            </div>
          </div>

          <div className="flex flex-col space-y-4">
            <h3 className="text-lg font-bold">Shop</h3>
            <Link to="/category/customized-book" className="text-muted-foreground hover:text-storybook-purple transition-colors">
              Custom Books
            </Link>
            <Link to="/category/regular-book" className="text-muted-foreground hover:text-storybook-purple transition-colors">
              Regular Books
            </Link>
            <Link to="/category/poster" className="text-muted-foreground hover:text-storybook-purple transition-colors">
              Posters
            </Link>
          </div>

          <div className="flex flex-col space-y-4">
            <h3 className="text-lg font-bold">About</h3>
            <Link to="/about" className="text-muted-foreground hover:text-storybook-purple transition-colors">
              Our Story
            </Link>
            <Link to="/faq" className="text-muted-foreground hover:text-storybook-purple transition-colors">
              FAQ
            </Link>
            <Link to="/contact" className="text-muted-foreground hover:text-storybook-purple transition-colors">
              Contact Us
            </Link>
          </div>

          <div className="flex flex-col space-y-4">
            <h3 className="text-lg font-bold">Policies</h3>
            <Link to="/shipping" className="text-muted-foreground hover:text-storybook-purple transition-colors">
              Shipping Policy
            </Link>
            <Link to="/returns" className="text-muted-foreground hover:text-storybook-purple transition-colors">
              Return Policy
            </Link>
            <Link to="/privacy" className="text-muted-foreground hover:text-storybook-purple transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-muted-foreground hover:text-storybook-purple transition-colors">
              Terms & Conditions
            </Link>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-muted-foreground/20 text-center text-muted-foreground">
          <p>&copy; {currentYear} StoryBook Emporium. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
