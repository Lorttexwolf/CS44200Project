import pool from "@/lib/db";
import { RowDataPacket } from "mysql2";
import { ParkingFloor, ParkingFloorSchema } from "./ParkingFloor";
import { ParkingLot } from "./ParkingLot";

export async function queryFloorsOfParkingLot(lotID: ParkingLot["ID"]) {

    const [rows] = await pool.query<RowDataPacket[]>(`

        SELECT 
            f.Floor_Number,
            f.Floor_Name,
            f.Available_Spots,
            f.Total_Spots,
            f.Floor_ID,
            f.Created_At,
            GROUP_CONCAT(ff.Feature_Name) AS Features
        FROM ParkingFloor f
        LEFT JOIN ParkingFloorFeatures ff 
            ON ff.Fk_Floor_ID = f.Floor_ID
        WHERE f.Pk_Lot_ID = ?
        GROUP BY 
            f.Floor_ID, 
            f.Floor_Number, 
            f.Floor_Name, 
            f.Available_Spots, 
            f.Total_Spots, 
            f.Created_At
        ORDER BY f.Floor_Number;`,

        [lotID]

    );

    return rows.map(r => ParkingFloorSchema.parse({

        ID: r.Floor_ID,
        AvailableSpots: r.Available_Spots,
        TotalSpots: r.Total_Spots,
        CreatedAt: r.Created_At,
        Features: (r.Features as string).split(","),
        Floor: r.Floor_Number,
        FloorName: r.Floor_Name

    } as ParkingFloor));

}