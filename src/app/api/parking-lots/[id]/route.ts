import { NextRequest, NextResponse } from 'next/server';
import { getParkingLotById } from '@/lib/parkingLotService';

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
