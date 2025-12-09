import CampusHero from "@/components/CampusHero";
import CampusSelection from "@/components/CampusSelection";
import Features from "@/components/Features";
import HorizontalWrap from "@/components/HorizontalWrap";
import TeamGrid from "@/components/team/teamGrid";

export default function App() {
    return (
        <div className="min-h-screen bg-white">
            <CampusHero videoURL="/mainVid.mp4" />

            <Features />
            
            <section id="campuses">
                <CampusSelection />
            </section>

            <section className="bg-white">
                <HorizontalWrap>
                    <TeamGrid />
                </HorizontalWrap>
            </section>
        </div>
    );
}
