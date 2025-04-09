
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FeaturedProducts from "@/components/FeaturedProducts";
import CategorySection from "@/components/CategorySection";
import WhatsAppButton from "@/components/WhatsAppButton";

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <FeaturedProducts />
        <CategorySection />
        
        <section className="py-16 bg-storybook-light-purple">
          <div className="container text-center">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-12">
              Creating your personalized storybook is simple and magical.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="w-12 h-12 bg-storybook-purple text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">1</div>
                <h3 className="text-xl font-semibold mb-2">Choose Your Book</h3>
                <p className="text-muted-foreground">Browse our catalog and select the perfect book or poster for your child.</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="w-12 h-12 bg-storybook-purple text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">2</div>
                <h3 className="text-xl font-semibold mb-2">Place Your Order</h3>
                <p className="text-muted-foreground">Add items to your cart, provide shipping details, and complete your purchase.</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="w-12 h-12 bg-storybook-purple text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">3</div>
                <h3 className="text-xl font-semibold mb-2">Personalization & Delivery</h3>
                <p className="text-muted-foreground">We'll contact you via WhatsApp for personalization details and payment, then deliver your custom creation.</p>
              </div>
            </div>
            
            <div className="flex justify-center">
              <WhatsAppButton message="Hi! I have a question about ordering a custom book." />
            </div>
          </div>
        </section>
        
        <section className="py-16">
          <div className="container">
            <div className="bg-storybook-light-orange rounded-lg p-8 md:p-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div>
                  <h2 className="text-3xl font-bold mb-4">Need Help or Have Questions?</h2>
                  <p className="text-lg mb-6">
                    We're here to assist you with choosing the perfect book, customization options, or any other inquiries you might have.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <WhatsAppButton variant="default" message="Hi! I need some help with my order." />
                  </div>
                </div>
                <div className="flex justify-center">
                  <img 
                    src="/placeholder.svg" 
                    alt="Customer Support" 
                    className="max-w-[300px] rounded-lg shadow-lg"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      
      {/* Fixed WhatsApp button */}
      <div className="fixed bottom-6 right-6 z-50">
        <WhatsAppButton size="lg" message="Hi! I'm interested in your products." />
      </div>
    </div>
  );
};

export default Index;
