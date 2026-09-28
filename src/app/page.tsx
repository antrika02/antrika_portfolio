import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import CodingStats from "@/components/CodingStats";
import ChatWidget from "@/components/ChatWidget";
import { About, Contact, EducationAchievements, Experience, Footer, Projects, Skills } from "@/components/Sections";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="overflow-x-clip">
        <Hero />
        <About />
        <Skills />
        <Experience />
        <Projects />
        <CodingStats />
        <EducationAchievements />
        <Contact />
      </main>
      <Footer />
      <ChatWidget />
    </>
  );
}
