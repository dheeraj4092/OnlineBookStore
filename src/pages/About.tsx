import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const About = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow container py-12">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">About Us – VisionWall</h1>
            <p className="text-xl text-muted-foreground">
              We're not just a company—we're a teen-powered dream team! 🚀
            </p>
          </div>

          <div className="prose prose-lg mx-auto">
            <p className="mb-6">
              VisionWall was founded in 2024 by four passionate and creative teens: Atiksh, Prateesh, Ishaan, and Shlok. We came together with one goal: to bring bold ideas to life through stunning posters, creative books, and products that inspire young minds like ours.
            </p>

            <p className="mb-6">
              From brainstorming in our notebooks to building a real business, we're proof that age doesn't limit ambition. At VisionWall, every design has a purpose, every idea is fueled by passion, and every product reflects our vision—Your Vision, Your Wall.
            </p>

            <p className="mb-6">
              We're just getting started, and trust us, the future looks epic. 💡📈
            </p>
          </div>

          <div className="mt-12 text-center">
            <h2 className="text-2xl font-bold mb-4">Our Team</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { name: "Atiksh", role: "Founder" },
                { name: "Prateesh", role: "Founder" },
                { name: "Ishaan", role: "Founder" },
                { name: "Shlok", role: "Founder" },
              ].map((member) => (
                <div key={member.name} className="bg-muted rounded-lg p-6">
                  <h3 className="font-bold text-lg mb-2">{member.name}</h3>
                  <p className="text-muted-foreground">{member.role}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default About; 