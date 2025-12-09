import ParkingLots from "@/components/ParkingLots";
import { queryCampusByName } from "@/models/CampusServe";
import { redirect } from "next/navigation";

export default async function Campus({ params }: { params: Promise<{ campus: string }> }) {
    console.log("Hello?");

    const campusShortName = (await params).campus;

    console.log("Hello2?");

    const campus = await queryCampusByName(campusShortName);

    if (!campus) redirect("/");

    return <>

        <div className="w-full h-[50vh] mt-14 bg-white relative flex justify-center items-center">

            {campus.VideoURL && <>

                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full absolute object-cover brightness-50"
                    src={campus.VideoURL}>

                </video>

            </>}

            {/* <img src={campus.IconURL} className="h-36 z-10"/> */}

            <p className="text-white text-2xl font-medium z-10">{campus.Name} Parking</p>

        </div>

        <div>

            <ParkingLots campusID={campus.ID} />

        </div>

    </>

}