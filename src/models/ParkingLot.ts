import z from "zod";
import { ParkingFloorSchema } from "./ParkingFloor";

export const ParkingLotSchema = z.object({

    ID: z.number(),
    CampusID: z.number(),
    Name: z.string(),
    Address: z.string(),
    ImageFileName: z.string().optional().nullable(),
    Latitude: z.coerce.number(),
    Longitude: z.coerce.number(),
    CreatedAt: z.date(),

    Floors: ParkingFloorSchema.array(),

    // TotalSpots & AvailableSpots is computed by Floors ^

    TotalSpots: z.coerce.number(),
    AvailableSpots: z.coerce.number()

});

export type ParkingLot = z.infer<typeof ParkingLotSchema>;