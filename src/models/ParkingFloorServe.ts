import pool from "@/lib/db";
import { RowDataPacket } from "mysql2";
import { ParkingLot } from "./ParkingLot";

export async function queryFloorsOfParkingLot(lotID: ParkingLot["ID"]) {

    const [rows] = await pool.query<RowDataPacket[]>(`

        SELECT Floor_Number, Floor_Name, Available_Spots, Total_Spots, Floor_ID
        FROM ParkingFloor
        WHERE Pk_Lot_ID = ?
        ORDER BY Floor_Number`,

        [lotID]

    );

    return rows.map(r => )

}