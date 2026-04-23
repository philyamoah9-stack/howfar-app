import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Pillars from "./components/Pillars";
import Community from "./components/Community";

export default function Home() {
  return (
    <>
      <Navbar />
      <main style={{ background: "#0a0a0a" }}>
        <Hero />
        <Pillars />
        <Community />
      </main>
    </>
  );
}