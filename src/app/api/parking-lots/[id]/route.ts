import { NextRequest, NextResponse } from 'next/server';
import {
  getParkingLotById,
  updateParkingLot,
  deleteParkingLot,
} from '@/lib/parkingLotService';

// GET a single parking lot
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const lot = await getParkingLotById(parseInt(id));
    
    if (!lot) {
      return NextResponse.json(
        { error: 'Parking lot not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(lot);
  } catch (error) {
    console.error('Error fetching parking lot:', error);
    return NextResponse.json(
      { error: 'Failed to fetch parking lot' },
      { status: 500 }
    );
  }
}

// PUT update a parking lot
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const success = await updateParkingLot(parseInt(id), body);

    if (!success) {
      return NextResponse.json(
        { error: 'Parking lot not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Parking lot updated successfully' });
  } catch (error) {
    console.error('Error updating parking lot:', error);
    return NextResponse.json(
      { error: 'Failed to update parking lot' },
      { status: 500 }
    );
  }
}

// DELETE a parking lot
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const success = await deleteParkingLot(parseInt(id));

    if (!success) {
      return NextResponse.json(
        { error: 'Parking lot not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Parking lot deleted successfully' });
  } catch (error) {
    console.error('Error deleting parking lot:', error);
    return NextResponse.json(
      { error: 'Failed to delete parking lot' },
      { status: 500 }
    );
  }
}
