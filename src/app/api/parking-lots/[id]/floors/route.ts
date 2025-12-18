import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const lotID = parseInt(id);
    const body = await request.json();
    const { FloorNumber, FloorName, TotalSpots, AvailableSpots } = body;

    if (!FloorNumber || !FloorName) {
      return NextResponse.json({ error: 'FloorNumber and FloorName are required' }, { status: 400 });
    }

    const [result] = await pool.query(
      `INSERT INTO ParkingFloor (Pk_Lot_ID, Floor_Number, Floor_Name, Total_Spots, Available_Spots)
       VALUES (?, ?, ?, ?, ?)`,
      [lotID, FloorNumber, FloorName, TotalSpots || 0, AvailableSpots || 0]
    );

    const insertId = (result as any).insertId;

    return NextResponse.json({ success: true, id: insertId }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to create floor' }, { status: 500 });
  }
}
