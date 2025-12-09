import { getParkingLotById } from '@/lib/parkingLotService';
import { deleteParkingLot, queryParkingLot } from '@/models/ParkingLotServe';
import { NextRequest, NextResponse } from 'next/server';

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

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	const lotID = parseInt((await params).id);

	try {
		const parkingLot = await queryParkingLot(lotID);

		if (!parkingLot) return NextResponse.json({ error: "Parking Lot not Found!" }, { status: 404 });

		await deleteParkingLot(lotID);

		return new NextResponse(null, { status: 200 });
	}
	catch (error) {
		return NextResponse.json({ error: 'Failed to remove Parking Lot' }, { status: 500 });
	}
}