import { queryParkingLotsOfCampus } from '@/models/ParkingLotServe';
import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

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

		const lots = await queryParkingLotsOfCampus(parseInt(campusId));
		return NextResponse.json(lots);

	} catch (error) {
		console.error('Error fetching parking lots:', error);
		return NextResponse.json(
			{ error: 'Failed to fetch parking lots' },
			{ status: 500 }
		);
	}
}

// POST create new parking lot
export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const { Name, Address, ImageFileName, Latitude, Longitude, CampusID, TotalSpots, AvailableSpots } = body;

		if (!Name || !Address || !CampusID) {
			return NextResponse.json(
				{ error: 'Name, Address, and CampusID are required' },
				{ status: 400 }
			);
		}

		// Insert parking lot
		const [result] = await pool.query(
			`INSERT INTO ParkingLot (Pk_Campus_ID, Lot_Name, Address, ImageFileName, Latitude, Longitude) 
			 VALUES (?, ?, ?, ?, ?, ?)`,
			[CampusID, Name, Address, ImageFileName || null, Latitude || 0, Longitude || 0]
		);

		const insertId = (result as any).insertId;

		// Create a default floor for the parking lot with the provided spot counts
		if (body.Floors && Array.isArray(body.Floors) && body.Floors.length > 0) {
			// Insert provided floors
			for (const f of body.Floors) {
				const floorNumber = f.FloorNumber ?? f.Floor ?? 1;
				const floorName = f.FloorName ?? 'Floor ' + floorNumber;
				const total = f.TotalSpots || 0;
				const avail = f.AvailableSpots || 0;
				await pool.query(
					`INSERT INTO ParkingFloor (Pk_Lot_ID, Floor_Number, Floor_Name, Total_Spots, Available_Spots)
					 VALUES (?, ?, ?, ?, ?)`,
					[insertId, floorNumber, floorName, total, avail]
				);
			}
		} else {
			await pool.query(
				`INSERT INTO ParkingFloor (Pk_Lot_ID, Floor_Number, Floor_Name, Total_Spots, Available_Spots)
				 VALUES (?, 1, 'Ground Floor', ?, ?)`,
				[insertId, TotalSpots || 0, AvailableSpots || 0]
			);
		}

		return NextResponse.json({ 
			success: true, 
			id: insertId,
			message: 'Parking lot created successfully' 
		}, { status: 201 });

	} catch (error) {
		console.error('Error creating parking lot:', error);
		return NextResponse.json(
			{ error: 'Failed to create parking lot' },
			{ status: 500 }
		);
	}
}
