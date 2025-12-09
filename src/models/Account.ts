import z from "zod";

export const AccountSchema = z.object({

    Email: z.url(),
    Verified: z.boolean(),
    FirstName: z.string(),
    LastName: z.string(),
    Permission: z.enum(["user", "admin"]),
    CreatedAt: z.date()

});

export type Account = z.infer<typeof AccountSchema>;