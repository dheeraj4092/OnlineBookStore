import { Link } from "react-router-dom";
import { ShoppingCart, Menu, X, User, LogOut } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/stores/cartStore";
import { useAuthStore } from "@/stores/authStore";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { getItemCount } = useCartStore();
  const { user, signOut } = useAuthStore();
  const itemCount = getItemCount();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-storybook-purple">StoryBook</span>
            <span className="text-2xl font-bold text-storybook-orange">Emporium</span>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button className="block md:hidden" onClick={toggleMenu}>
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-foreground hover:text-storybook-purple transition-colors">
            Home
          </Link>
          <Link to="/category/customized-book" className="text-foreground hover:text-storybook-purple transition-colors">
            Custom Books
          </Link>
          <Link to="/category/regular-book" className="text-foreground hover:text-storybook-purple transition-colors">
            Regular Books
          </Link>
          <Link to="/category/poster" className="text-foreground hover:text-storybook-purple transition-colors">
            Posters
          </Link>
          <Link to="/about" className="text-foreground hover:text-storybook-purple transition-colors">
            About
          </Link>
          <Link to="/contact" className="text-foreground hover:text-storybook-purple transition-colors">
            Contact
          </Link>
          
          {/* Cart Button */}
          <Button variant="outline" size="icon" asChild className="relative">
            <Link to="/cart">
              <ShoppingCart className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-storybook-purple text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {itemCount > 9 ? '9+' : itemCount}
                </span>
              )}
              <span className="sr-only">Shopping Cart</span>
            </Link>
          </Button>
          
          {/* User Menu */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <User className="h-5 w-5" />
                  <span className="sr-only">User Menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <div className="p-2">
                  <p className="text-sm font-medium">{user.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/orders">My Orders</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild variant="outline">
              <Link to="/signin">Sign In</Link>
            </Button>
          )}
        </nav>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="absolute top-16 left-0 w-full bg-background border-b md:hidden z-50 transition-all duration-300 ease-in-out shadow-lg">
            <nav className="flex flex-col p-6 space-y-6">
              <Link 
                to="/" 
                className="text-foreground hover:text-storybook-purple transition-colors text-lg py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/category/customized-book" 
                className="text-foreground hover:text-storybook-purple transition-colors text-lg py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Custom Books
              </Link>
              <Link 
                to="/category/regular-book" 
                className="text-foreground hover:text-storybook-purple transition-colors text-lg py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Regular Books
              </Link>
              <Link 
                to="/category/poster" 
                className="text-foreground hover:text-storybook-purple transition-colors text-lg py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Posters
              </Link>
              <Link 
                to="/about" 
                className="text-foreground hover:text-storybook-purple transition-colors text-lg py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link 
                to="/contact" 
                className="text-foreground hover:text-storybook-purple transition-colors text-lg py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
              <Link 
                to="/cart" 
                className="flex items-center space-x-3 text-foreground hover:text-storybook-purple transition-colors text-lg py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="relative">
                  <ShoppingCart className="h-6 w-6" />
                  {itemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-storybook-purple text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {itemCount > 9 ? '9+' : itemCount}
                    </span>
                  )}
                </div>
                <span>Cart</span>
              </Link>
              
              {/* Mobile User Menu */}
              {user ? (
                <>
                  <div className="pt-4 border-t">
                    <p className="text-sm font-medium">{user.email}</p>
                  </div>
                  <Link 
                    to="/profile" 
                    className="text-foreground hover:text-storybook-purple transition-colors text-lg py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <Link 
                    to="/orders" 
                    className="text-foreground hover:text-storybook-purple transition-colors text-lg py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    My Orders
                  </Link>
                  <button
                    onClick={() => {
                      handleSignOut();
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center text-foreground hover:text-storybook-purple transition-colors text-lg py-2"
                  >
                    <LogOut className="mr-2 h-5 w-5" />
                    <span>Sign Out</span>
                  </button>
                </>
              ) : (
                <Link 
                  to="/signin" 
                  className="text-foreground hover:text-storybook-purple transition-colors text-lg py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign In
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
