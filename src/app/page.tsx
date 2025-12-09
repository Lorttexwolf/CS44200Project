
import Features from "@/components/Features";
import Hero from "@/components/Hero";
import HorizontalWrap from "@/components/HorizontalWrap";
import HowItWorks from "@/components/HowItWorks";
import TeamGrid from "@/components/team/teamGrid";



export default function App() {
    return (
        <div className="min-h-screen bg-white">

            <Hero/>
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