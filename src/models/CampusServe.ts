import pool from "@/lib/db";
import { RowDataPacket } from "mysql2/promise";
import { Campus, CampusSchema } from "./Campus";

export async function queryCampusByName(name: string)
{
    const [results, fields] = (await pool.query<RowDataPacket[]>(
        "SELECT * FROM Campus WHERE Campus_Name = ? OR Campus_Short_Name = ?",
        [name, name]));

    const rawCampus = results.at(0);

    const campus = rawCampus ? CampusSchema.safeParse({

        ID: rawCampus.Pk_Campus_ID,
        Name: rawCampus.Campus_Name,
        ShortName: rawCampus.Campus_Short_Name,
        Description: rawCampus.Campus_Description,
        Domain: rawCampus.Domain,
        IconURL: rawCampus.Icon_URL,
        VideoURL: rawCampus.Video_URL

    } as Campus)?.data : null;

    return campus;
}