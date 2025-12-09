import pool from "@/lib/db";
import { RowDataPacket } from "mysql2/promise";
import { queryFloorsOfParkingLot } from "./ParkingFloorServe";
import { ParkingLot, ParkingLotSchema } from "./ParkingLot";

export async function queryParkingLotsOfCampus(campusID: number) {

    const [rows] = await pool.query<RowDataPacket[]>(`
        
        SELECT 
            l.Pk_Campus_ID,
            l.Pk_Lot_ID,
            l.Lot_Name,
            l.ImageFileName,
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
                l.ImageFileName,
                l.Address,
                l.Latitude,
                l.Longitude,
                l.Created_At;`,

        [campusID]
    );

    return Promise.all(rows.map(async r => {

        const floors = await queryFloorsOfParkingLot(r.Pk_Lot_ID);

        return ParkingLotSchema.parse({

            ID: r.Pk_Lot_ID,
            CampusID: r.Pk_Campus_ID,
            Name: r.Lot_Name,
            Address: r.Address,
            ImageFileName: r.ImageFileName,
            AvailableSpots: r.Available_Spots,
            TotalSpots: r.Total_Spots,
            CreatedAt: r.Created_At,
            Latitude: r.Latitude,
            Longitude: r.Longitude,
            Floors: floors

        } as ParkingLot);

    }));
}

export async function queryParkingLot(lotID: number) {

    const [rows] = await pool.query<RowDataPacket[]>(`
        
        SELECT 
            l.Pk_Campus_ID,
            l.Pk_Lot_ID,
            l.Lot_Name,
            l.ImageFileName,
            l.Address,
            SUM(f.Total_Spots) AS Total_Spots,
            SUM(f.Available_Spots) AS Available_Spots,
            l.Latitude,
            l.Longitude,
            l.Created_At
        FROM ParkingLot l
        JOIN ParkingFloor f 
            ON f.Pk_Lot_ID = l.Pk_Lot_ID
        WHERE l.Pk_Lot_ID = ?
        GROUP BY l.Pk_Lot_ID,
                l.Lot_Name,
                l.ImageFileName,
                l.Address,
                l.Latitude,
                l.Longitude,
                l.Created_At;`,

        [lotID]
    );

    const r = rows.at(0);

    return r ? ParkingLotSchema.parse({

        ID: r.Pk_Lot_ID,
        CampusID: r.Pk_Campus_ID,
        Name: r.Lot_Name,
        Address: r.Address,
        ImageFileName: r.ImageFileName,
        AvailableSpots: r.Available_Spots,
        TotalSpots: r.Total_Spots,
        CreatedAt: r.Created_At,
        Latitude: r.Latitude,
        Longitude: r.Longitude,
        Floors: await queryFloorsOfParkingLot(lotID)

    } as ParkingLot) : null;
}

export async function deleteParkingLot(lotID: number)
{
    await pool.query("DELETE FROM ParkingLot WHERE Pk_Lot_ID = ?", [ lotID ]);
}