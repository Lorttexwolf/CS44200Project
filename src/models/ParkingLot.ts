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

// Schema for creating a new parking lot (excludes auto-generated fields)
export const CreateParkingLotSchema = ParkingLotSchema.omit({
    ID: true,
    CreatedAt: true,
    Floors: true
});

export type CreateParkingLot = z.infer<typeof CreateParkingLotSchema>;

// Allow creating a parking lot with optional floors
export const CreateParkingLotWithFloorsSchema = CreateParkingLotSchema.extend({
    Floors: ParkingFloorSchema.array().optional(),
});

export type CreateParkingLotWithFloors = z.infer<typeof CreateParkingLotWithFloorsSchema>;