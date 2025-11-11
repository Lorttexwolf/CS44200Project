import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import ParkingLots from "@/components/ParkingLots";
import HowItWorks from "@/components/HowItWorks";
import TeamGrid from "@/components/team/teamGrid";
import HorizontalWrap from "@/components/HorizontalWrap";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

export default function App() {
    return (
        <div className="min-h-screen bg-white">
            <Header/>
            <Hero/>
            <Features/>
            <ParkingLots/>
            <HowItWorks/>

            <section id="team" className="bg-white">
                <HorizontalWrap>
                    <TeamGrid/>
                </HorizontalWrap>
            </section>

            <CTA/>
            <Footer/>
        </div>
    );
}