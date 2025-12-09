import pool from "@/lib/db";
import { RowDataPacket } from "mysql2/promise";
import { ParkingLot, ParkingLotSchema } from "./ParkingLot";

export async function queryParkingLotsOfCampus(campusID: number) {

    const [rows] = await pool.query<RowDataPacket[]>(`

        SELECT 
            Floor_Name, 
            SUM(f.Total_Spots) AS Total_Spots, 
            SUM(f.Available_Spots) AS Available_Spots 
        FROM ParkingLot l 
        WHERE Pk_Campus_ID = ? 
        JOIN ParkingFloor f ON l.Pk_Campus_ID = f.Pk_Lot_ID
        GROUP BY l.Pk_Lot_ID`,

        [campusID]
    );

    return rows.map(r => ParkingLotSchema.parse({

        Name: r.Lot_Name,
        Address: r.Address,
        Image_URL: r.Image_URL,
        AvailableSpots: r.Available_Spots,
        TotalSpots: r.Total_Spots,
        
    } as ParkingLot));

}