import z from "zod";
import { ParkingFloorSchema } from "./ParkingFloor";

export const ParkingLotSchema = z.object({

    ID: z.number(),
    Name: z.string(),
    Address: z.string(),
    Image_URL: z.url(),
    Latitude: z.number(),
    Longitude: z.number(),
    CreatedAt: z.date(),

    Features: z.string().array(),
    Floors: ParkingFloorSchema.array(),

    // TotalSpots & AvailableSpots is computed by Floors ^

    TotalSpots: z.number(),
    AvailableSpots: z.number()

});

export type ParkingLot = z.infer<typeof ParkingLotSchema>;