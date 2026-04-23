import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Pillars from "./components/Pillars";
import Community from "./components/Community";
import Finance from "./components/Finance";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main style={{ background: "#0a0a0a" }}>
        <Hero />
        <Pillars />
        <Finance />
        <Community />
        <Footer />
      </main>
    </>
  );
}