import Features from "@/components/Features";
import CampusSelection from "@/components/CampusSelection";
import HorizontalWrap from "@/components/HorizontalWrap";
import HowItWorks from "@/components/HowItWorks";
import TeamGrid from "@/components/team/teamGrid";
import CampusHero from "@/components/CampusHero";

export default function App() {
  return (
    <div className="min-h-screen bg-white">
      <CampusHero videoURL="/mainVid.mp4" />
      
      <Features />
      <HowItWorks />

        <CampusSelection />

      <section className="bg-white">
        <HorizontalWrap>
          <TeamGrid />
        </HorizontalWrap>
      </section>
    </div>
  );
}
