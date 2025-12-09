import pool from "@/lib/db";
import { RowDataPacket } from "mysql2/promise";
import { Account, AccountSchema } from "./Account";

export async function queryAccountByEmail(email: string)
{
    const [results, fields] = (await pool.query<RowDataPacket[]>(
        "SELECT Account_Email, Verified, First_Name, Last_Name, Service_Permissions, Created_at FROM Account WHERE Account_Email = ?",
        [email]));

    const rawAccount = results.at(0);

    return rawAccount ? AccountSchema.safeParse({

        Email: rawAccount.Account_Email,
        FirstName: rawAccount.First_Name,
        LastName: rawAccount.Last_Name,
        Verified: rawAccount.Verified,
        Permission: rawAccount.Service_Permissions,
        CreatedAt: rawAccount.Created_At

    } as Account)?.data : null;
    
}