import Image from "next/image";
import HorizontalWrap from "../components/HorizontalWrap";
import TeamGrid from "@/components/team/teamGrid";

export default function Home() {
    return (
        <div className="text-lg pt-10">

            <HorizontalWrap>

                <h1 className="text-blue-500 text-6xl font-bold flex justify-center">PNW parking</h1>

                <br/> {/* Maybe change for flex box separation? */}

                <div className="grid grid-cols-2 gap-5 py-10">

                    <section className="grid-cols-subgrid flex justify-center items-center">
                        <div>
                            <Image
                                src="/campus.jpg"
                                alt="Campus Parking"
                                width={500}
                                height={300}
                                className="rounded-lg"/>
                        </div>
                    </section>

                    <section className="p-5 grid-cols-subgrid">
                        <p>
                            Welcome to our project!
                        </p>

                        <h2 className="my-2">Parking on campus</h2>
                        <p className="my-2">
                            How often are you late to class and can't find parking?<br/>
                            Our project aims to solve this.<br/>
                            By letting you know where you can find a parking spot.<br/>
                            This will save you time instead of going around and around looking for a spot.<br/>
                        </p>

                        <Image
                            src="/mini.jpg"
                            alt="Campus Parking"
                            width={500}
                            height={300}
                            className="rounded-lg mt-4"/>

                    </section>
                </div>

            </HorizontalWrap>
            <div className="bg-blue-300">
                <TeamGrid/>
            </div>

        </div>
    );
}
