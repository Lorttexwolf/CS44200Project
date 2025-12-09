import ParkingLots from "@/components/ParkingLots";
import Hero from "@/components/Hero";
import { queryCampusByName } from "@/models/CampusServe";
import { redirect } from "next/navigation";

export default async function Campus({ params }: { params: Promise<{ campus: string }> }) {
    const campusShortName = (await params).campus;
    const campus = await queryCampusByName(campusShortName);

    if (!campus) redirect("/");

    return <>
        <Hero campusID={campus.ID} campusName={campus.Name} videoURL={campus.VideoURL || "/lotVid.mp4"} />
        
        <div>
            <ParkingLots campusID={campus.ID} campusShortName={campus.ShortName} />
        </div>
    </>
}