import pool from "@/lib/db";
import { RowDataPacket } from "mysql2/promise";
import { queryFloorsOfParkingLot } from "./ParkingFloorServe";
import { ParkingLot, ParkingLotSchema } from "./ParkingLot";

export async function queryParkingLotsOfCampus(campusID: number) {

    const [rows] = await pool.query<RowDataPacket[]>(`

        SELECT 
            f.Pk_Lot_ID,
            f.Floor_Name,
            f.Lot_Name,
            f.Image_URL,
            f.Address,
            SUM(f.Total_Spots) AS Total_Spots, 
            SUM(f.Available_Spots) AS Available_Spots,
            f.Latitude,
            f.Longitude,
            f.Created_At
        FROM ParkingLot l 
        WHERE Pk_Campus_ID = ? 
        JOIN ParkingFloor f ON l.Pk_Campus_ID = f.Pk_Lot_ID
        GROUP BY l.Pk_Lot_ID`,

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