import { NextRequest, NextResponse } from 'next/server';
import { getParkingLots, createParkingLot } from '@/lib/parkingLotService';

// GET all parking lots for a campus
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const campusId = searchParams.get('campusId');

    if (!campusId) {
      return NextResponse.json(
        { error: 'Campus ID is required' },
        { status: 400 }
      );
    }

    const lots = await getParkingLots(parseInt(campusId));
    return NextResponse.json(lots);
  } catch (error) {
    console.error('Error fetching parking lots:', error);
    return NextResponse.json(
      { error: 'Failed to fetch parking lots' },
      { status: 500 }
    );
  }
}

// POST create a new parking lot
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const lotId = await createParkingLot(body);
    
    return NextResponse.json(
      { id: lotId, message: 'Parking lot created successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating parking lot:', error);
    return NextResponse.json(
      { error: 'Failed to create parking lot' },
      { status: 500 }
    );
  }
}
