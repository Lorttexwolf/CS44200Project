import TeamMemberCard from "./TeamMemberCard";

export default function TeamGrid() {
    return (
        <section className="py-20">
            <div className="max-w-6xl mx-auto px-4">
                <h2 className="text-5xl font-bold text-center text-blue-900 mb-4">
                    Meet the team!
                </h2>
                <p className="text-2xl text-center text-gray-900 max-w-3xl mx-auto mb-16">
                    We are PNW Computer Scinece students of CS 44200!
                </p>

                <div className="grid md:grid-cols-4 gap-8">

                    <TeamMemberCard
                        imageSrc="/team/Jih.jpg"
                        name="Jih Bin Luo"
                        role="FullStack engineer"
                        roleColor="text-red-600"
                        description=""
                        skills={["React", "TailwindCSS", "Supabase", "NextJS"]}
                        email="jluoliu@pnw.edu"
                        githubUrl="https://github.com/Fortakenjay"/>

                    <TeamMemberCard
                        imageSrc="/team/isa.jpg"
                        name="Isabella Sosa"  
                        role="FrontEnd engineer"
                        roleColor="text-red-600"
                        description="Computer Science student at PNW."
                        skills={["HTML", "TailwindCSS"]}
                        email="sosai@pnw.edu"
                        githubUrl="https://github.com/isasero29"/>
                        

                    <TeamMemberCard
                        imageSrc="/team/Aarom.jpg"
                        name="Aaron Jung"
                        role="FullStack Engineer"
                        roleColor="text-red-600"
                        description=""/>

                    <TeamMemberCard
                        imageSrc="/team/justin.jpg"
                        name="Justin Meng"
                        role="BackEnd Engineer"
                        roleColor="text-red-600"
                        description="Computer Science student at PNW"
                        skills={["C#", "HTML"]}
                        email="meng172@pnw.edu"
                        githubUrl="https://github.com/JMCode12"/>

                </div>
            </div>
        </section>
    );
}
