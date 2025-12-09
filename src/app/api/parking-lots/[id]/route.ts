import { getParkingLotById } from '@/lib/parkingLotService';
import { deleteParkingLot, queryParkingLot } from '@/models/ParkingLotServe';
import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

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

// PUT update parking lot
export async function PUT(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const { id } = await params;
		const lotID = parseInt(id);
		const body = await request.json();

		const parkingLot = await queryParkingLot(lotID);
		if (!parkingLot) {
			return NextResponse.json(
				{ error: 'Parking lot not found' },
				{ status: 404 }
			);
		}

		// Build update query dynamically based on provided fields
		const updates: string[] = [];
		const values: any[] = [];

		if (body.Name !== undefined) {
			updates.push('Lot_Name = ?');
			values.push(body.Name);
		}
		if (body.Address !== undefined) {
			updates.push('Address = ?');
			values.push(body.Address);
		}
		if (body.ImageFileName !== undefined) {
			updates.push('ImageFileName = ?');
			values.push(body.ImageFileName);
		}
		if (body.Latitude !== undefined) {
			updates.push('Latitude = ?');
			values.push(body.Latitude);
		}
		if (body.Longitude !== undefined) {
			updates.push('Longitude = ?');
			values.push(body.Longitude);
		}

		if (updates.length === 0 && body.TotalSpots === undefined && body.AvailableSpots === undefined) {
			return NextResponse.json(
				{ error: 'No fields to update' },
				{ status: 400 }
			);
		}

		// Update parking lot table if there are changes
		if (updates.length > 0) {
			values.push(lotID);
			await pool.query(
				`UPDATE ParkingLot SET ${updates.join(', ')} WHERE Pk_Lot_ID = ?`,
				values
			);
		}

		// Update floor spots if provided
		if (body.TotalSpots !== undefined || body.AvailableSpots !== undefined) {
			const floorUpdates: string[] = [];
			const floorValues: any[] = [];

			if (body.TotalSpots !== undefined) {
				floorUpdates.push('Total_Spots = ?');
				floorValues.push(body.TotalSpots);
			}
			if (body.AvailableSpots !== undefined) {
				floorUpdates.push('Available_Spots = ?');
				floorValues.push(body.AvailableSpots);
			}

			floorValues.push(lotID);

			await pool.query(
				`UPDATE ParkingFloor SET ${floorUpdates.join(', ')} WHERE Pk_Lot_ID = ? AND Floor_Number = 1`,
				floorValues
			);
		}

		return NextResponse.json({ 
			success: true, 
			message: 'Parking lot updated successfully' 
		});

	} catch (error) {
		console.error('Error updating parking lot:', error);
		return NextResponse.json(
			{ error: 'Failed to update parking lot' },
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