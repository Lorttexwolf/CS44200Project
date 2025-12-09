import pool from './db';
import { Campus } from '@/models/Campus';
import { RowDataPacket } from 'mysql2';

export async function getCampuses(): Promise<Campus[]> {
  const sql = `
    SELECT 
      Pk_Campus_ID as id,
      Campus_Name as name,
      Campus_Short_Name as shortName,
      Campus_Description as description,
      Icon_URL as iconURL,
      Video_URL as videoURL,
      Domain as domain,
      Created_At as createdAt
    FROM Campus
    ORDER BY Campus_Name ASC
  `;

  const [rows] = await pool.query<RowDataPacket[]>(sql);
  return rows as Campus[];
}

export async function getCampusByShortName(shortName: string): Promise<Campus | null> {
  const sql = `
    SELECT 
      Pk_Campus_ID as id,
      Campus_Name as name,
      Campus_Short_Name as shortName,
      Campus_Description as description,
      Icon_URL as iconURL,
      Video_URL as videoURL,
      Domain as domain,
      Created_At as createdAt
    FROM Campus
    WHERE LOWER(Campus_Short_Name) = LOWER(?)
    LIMIT 1
  `;

  const [rows] = await pool.query<RowDataPacket[]>(sql, [shortName]);
  return rows.length > 0 ? rows[0] as Campus : null;
}

export async function getCampusById(id: number): Promise<Campus | null> {
  const sql = `
    SELECT 
      Pk_Campus_ID as id,
      Campus_Name as name,
      Campus_Short_Name as shortName,
      Campus_Description as description,
      Icon_URL as iconURL,
      Video_URL as videoURL,
      Domain as domain,
      Created_At as createdAt
    FROM Campus
    WHERE Pk_Campus_ID = ?
    LIMIT 1
  `;

  const [rows] = await pool.query<RowDataPacket[]>(sql, [id]);
  return rows.length > 0 ? rows[0] as Campus : null;
}
