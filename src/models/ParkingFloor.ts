import z from "zod";

export const ParkingFloorSchema = z.object({
   
    ID: z.number(),
    Floor: z.number(),
    FloorName: z.string(),
    TotalSpots: z.coerce.number(),
    AvailableSpots: z.coerce.number(),
    Features: z.string().array(),
    CreatedAt: z.date()

});

export type ParkingFloor = z.infer<typeof ParkingFloorSchema>;