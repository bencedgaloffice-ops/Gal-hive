import ApiaryBackground from "@/components/apiary/ApiaryBackground";
import Gate from "@/components/Gate";
import Nav from "@/components/Nav";
import Hero from "@/components/sections/Hero";
import Story from "@/components/sections/Story";
import Process from "@/components/sections/Process";
import Products from "@/components/sections/Products";
import Markets from "@/components/sections/Markets";
import Signup from "@/components/sections/Signup";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      {/* fixed living-apiary layer (WebGL, with graceful fallbacks) */}
      <ApiaryBackground />

      {/* entrance gate, floating over the apiary */}
      <Gate />

      {/* page content, above the canvas */}
      <div className="page" id="top">
        <Nav />
        <main>
          <Hero />
          <Story />
          <Process />
          <Products />
          <Markets />
          <Signup />
          <Contact />
        </main>
        <Footer />
      </div>
    </>
  );
}
