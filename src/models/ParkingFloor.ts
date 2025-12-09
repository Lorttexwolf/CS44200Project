import z from "zod";

export const ParkingFloorSchema = z.object({
   
    ID: z.number(),
    Floor: z.number(),
    FloorName: z.string(),
    TotalSpots: z.number(),
    AvailableSpots: z.number(),
    CreatedAt: z.date()

});

export type ParkingFloor = z.infer<typeof ParkingFloorSchema>;