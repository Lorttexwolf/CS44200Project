import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const floorID = parseInt(id);
    const body = await request.json();

    const updates: string[] = [];
    const values: any[] = [];

    if (body.FloorName !== undefined) {
      updates.push('Floor_Name = ?');
      values.push(body.FloorName);
    }
    if (body.TotalSpots !== undefined) {
      updates.push('Total_Spots = ?');
      values.push(body.TotalSpots);
    }
    if (body.AvailableSpots !== undefined) {
      updates.push('Available_Spots = ?');
      values.push(body.AvailableSpots);
    }
    if (body.FloorNumber !== undefined) {
      updates.push('Floor_Number = ?');
      values.push(body.FloorNumber);
    }

    if (updates.length === 0) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
    }

    values.push(floorID);

    await pool.query(`UPDATE ParkingFloor SET ${updates.join(', ')} WHERE Floor_ID = ?`, values);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to update floor' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const floorID = parseInt(id);

    await pool.query('DELETE FROM ParkingFloor WHERE Floor_ID = ?', [floorID]);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to delete floor' }, { status: 500 });
  }
}
