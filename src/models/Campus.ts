import z from "zod";

export const CampusSchema = z.object({

    ID: z.number(),
    Name: z.string(),
    ShortName: z.string(),
    Description: z.string(),

    Domain: z.string(),

    IconURL: z.url(),
    VideoURL: z.url().optional().nullable(),

});

export type Campus = z.infer<typeof CampusSchema>;
