import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Pillars from "./components/Pillars";

export default function Home() {
  return (
    <>
      <Navbar />
      <main style={{ background: "#0a0a0a" }}>
        <Hero />
        <Pillars />
      </main>
    </>
  );
}