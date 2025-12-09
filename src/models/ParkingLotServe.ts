import pool from "@/lib/db";
import { RowDataPacket } from "mysql2/promise";
import { queryFloorsOfParkingLot } from "./ParkingFloorServe";
import { ParkingLot, ParkingLotSchema } from "./ParkingLot";

export async function queryParkingLotsOfCampus(campusID: number) {

    const [rows] = await pool.query<RowDataPacket[]>(`
        SELECT 
    l.Pk_Lot_ID,
    l.Lot_Name,
    l.Image_URL,
    l.Address,
    SUM(f.Total_Spots) AS Total_Spots,
    SUM(f.Available_Spots) AS Available_Spots,
    l.Latitude,
    l.Longitude,
    l.Created_At
FROM ParkingLot l
JOIN ParkingFloor f 
    ON f.Pk_Lot_ID = l.Pk_Lot_ID
WHERE l.Pk_Campus_ID = ?
GROUP BY l.Pk_Lot_ID,
         l.Lot_Name,
         l.Image_URL,
         l.Address,
         l.Latitude,
         l.Longitude,
         l.Created_At;
`,

        [campusID]
    );

    return Promise.all(rows.map(async r => {

        const floors = await queryFloorsOfParkingLot(r.Pk_Lot_ID);

        return ParkingLotSchema.parse({

            ID: r.Pk_Lot_ID,
            Name: r.Lot_Name,
            Address: r.Address,
            Image_URL: r.Image_URL,
            AvailableSpots: r.Available_Spots,
            TotalSpots: r.Total_Spots,
            CreatedAt: r.Created_At,
            Latitude: r.Latitude,
            Longitude: r.Longitude,
            Floors: floors

        } as ParkingLot);

    }));
}