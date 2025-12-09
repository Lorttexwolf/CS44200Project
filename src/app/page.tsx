
import Features from "@/components/Features";
import CampusSelection from "@/components/CampusSelection";
import HorizontalWrap from "@/components/HorizontalWrap";
import HowItWorks from "@/components/HowItWorks";
import TeamGrid from "@/components/team/teamGrid";



export default function App() {
    return (
        <div className="min-h-screen bg-white">

            <CampusSelection/>
            <Features/>
            <HowItWorks/>

            <section id="team" className="bg-white">
                <HorizontalWrap>
                    <TeamGrid/>
                </HorizontalWrap>
            </section>

        </div>
    );
}