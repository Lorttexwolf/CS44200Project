import pool from './db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export interface ParkingFloor {
  floorNumber: number;
  floorName: string;
  available: number;
  total: number;
  features?: string[];
}

export interface ParkingLot {
  id?: number;
  name: string;
  address: string;
  distance: string;
  available: number;
  total: number;
  price: string;
  hourlyRate: string;
  image: string;
  covered: boolean;
  lat: number;
  lng: number;
  campusId: number;
  hasMultipleFloors?: boolean;
  floors?: ParkingFloor[];
  features?: string[];
}

// Get all parking lots for a campus
export async function getParkingLots(campusId: number): Promise<ParkingLot[]> {
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT 
      pl.Pk_Lot_ID as id,
      pl.Lot_Name as name,
      pl.Address as address,
      pl.Distance_From_Campus as distance,
      pl.Available_Spots as available,
      pl.Total_Spots as total,
      CONCAT('$', pl.Daily_Rate, '/day') as price,
      CONCAT('$', pl.Hourly_Rate, '/hour') as hourlyRate,
      pl.Image_URL as image,
      pl.Covered as covered,
      pl.Latitude as lat,
      pl.Longitude as lng,
      pl.Has_Multiple_Floors as hasMultipleFloors,
      pl.Pk_Campus_ID as campusId
    FROM ParkingLot pl
    WHERE pl.Pk_Campus_ID = ?`,
    [campusId]
  );

  const lots: ParkingLot[] = [];

  for (const row of rows) {
    const lot: ParkingLot = {
      id: row.id,
      name: row.name,
      address: row.address,
      distance: row.distance,
      available: row.available,
      total: row.total,
      price: row.price,
      hourlyRate: row.hourlyRate,
      image: row.image,
      covered: Boolean(row.covered),
      lat: parseFloat(row.lat),
      lng: parseFloat(row.lng),
      campusId: row.campusId,
      hasMultipleFloors: Boolean(row.hasMultipleFloors),
    };

    // Get features for single-level lots
    if (!lot.hasMultipleFloors) {
      const [features] = await pool.query<RowDataPacket[]>(
        'SELECT Feature_Name FROM ParkingLotFeatures WHERE Pk_Lot_ID = ?',
        [lot.id]
      );
      lot.features = features.map(f => f.Feature_Name);
    }

    // Get floors for multi-level lots
    if (lot.hasMultipleFloors) {
      const [floors] = await pool.query<RowDataPacket[]>(
        `SELECT 
          Floor_Number as floorNumber,
          Floor_Name as floorName,
          Available_Spots as available,
          Total_Spots as total,
          Floor_ID as floorId
        FROM ParkingFloor
        WHERE Pk_Lot_ID = ?
        ORDER BY Floor_Number`,
        [lot.id]
      );

      lot.floors = [];
      for (const floor of floors) {
        const [floorFeatures] = await pool.query<RowDataPacket[]>(
          'SELECT Feature_Name FROM FloorFeatures WHERE Floor_ID = ?',
          [floor.floorId]
        );

        lot.floors.push({
          floorNumber: floor.floorNumber,
          floorName: floor.floorName,
          available: floor.available,
          total: floor.total,
          features: floorFeatures.map(f => f.Feature_Name),
        });
      }
    }

    lots.push(lot);
  }

  return lots;
}

// Get a single parking lot by ID
export async function getParkingLotById(lotId: number): Promise<ParkingLot | null> {
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT 
      pl.Pk_Lot_ID as id,
      pl.Lot_Name as name,
      pl.Address as address,
      pl.Distance_From_Campus as distance,
      pl.Available_Spots as available,
      pl.Total_Spots as total,
      pl.Daily_Rate as dailyRate,
      pl.Hourly_Rate as hourlyRate,
      pl.Image_URL as image,
      pl.Covered as covered,
      pl.Latitude as lat,
      pl.Longitude as lng,
      pl.Has_Multiple_Floors as hasMultipleFloors,
      pl.Pk_Campus_ID as campusId
    FROM ParkingLot pl
    WHERE pl.Pk_Lot_ID = ?`,
    [lotId]
  );

  if (rows.length === 0) return null;

  const row = rows[0];
  const lot: ParkingLot = {
    id: row.id,
    name: row.name,
    address: row.address,
    distance: row.distance,
    available: row.available,
    total: row.total,
    price: `$${row.dailyRate}/day`,
    hourlyRate: `$${row.hourlyRate}/hour`,
    image: row.image,
    covered: Boolean(row.covered),
    lat: parseFloat(row.lat),
    lng: parseFloat(row.lng),
    campusId: row.campusId,
    hasMultipleFloors: Boolean(row.hasMultipleFloors),
  };

  // Get features or floors
  if (!lot.hasMultipleFloors) {
    const [features] = await pool.query<RowDataPacket[]>(
      'SELECT Feature_Name FROM ParkingLotFeatures WHERE Pk_Lot_ID = ?',
      [lot.id]
    );
    lot.features = features.map(f => f.Feature_Name);
  } else {
    const [floors] = await pool.query<RowDataPacket[]>(
      `SELECT 
        Floor_Number as floorNumber,
        Floor_Name as floorName,
        Available_Spots as available,
        Total_Spots as total,
        Floor_ID as floorId
      FROM ParkingFloor
      WHERE Pk_Lot_ID = ?
      ORDER BY Floor_Number`,
      [lot.id]
    );

    lot.floors = [];
    for (const floor of floors) {
      const [floorFeatures] = await pool.query<RowDataPacket[]>(
        'SELECT Feature_Name FROM FloorFeatures WHERE Floor_ID = ?',
        [floor.floorId]
      );

      lot.floors.push({
        floorNumber: floor.floorNumber,
        floorName: floor.floorName,
        available: floor.available,
        total: floor.total,
        features: floorFeatures.map(f => f.Feature_Name),
      });
    }
  }

  return lot;
}

// Create a new parking lot
export async function createParkingLot(lot: ParkingLot): Promise<number> {
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();

    // Extract daily rate from price string (e.g., "$5/day" -> 5)
    const dailyRate = parseFloat(lot.price.replace(/[^0-9.]/g, ''));
    const hourlyRate = parseFloat(lot.hourlyRate.replace(/[^0-9.]/g, ''));

    // Insert parking lot
    const [result] = await connection.query<ResultSetHeader>(
      `INSERT INTO ParkingLot 
      (Pk_Campus_ID, Lot_Name, Address, Distance_From_Campus, Covered, 
       Daily_Rate, Hourly_Rate, Image_URL, Latitude, Longitude, 
       Total_Spots, Available_Spots, Has_Multiple_Floors)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        lot.campusId,
        lot.name,
        lot.address,
        lot.distance,
        lot.covered,
        dailyRate,
        hourlyRate,
        lot.image,
        lot.lat,
        lot.lng,
        lot.total,
        lot.available,
        lot.hasMultipleFloors || false,
      ]
    );

    const lotId = result.insertId;

    // Insert features for single-level lots
    if (!lot.hasMultipleFloors && lot.features && lot.features.length > 0) {
      for (const feature of lot.features) {
        await connection.query(
          'INSERT INTO ParkingLotFeatures (Pk_Lot_ID, Feature_Name) VALUES (?, ?)',
          [lotId, feature]
        );
      }
    }

    // Insert floors for multi-level lots
    if (lot.hasMultipleFloors && lot.floors && lot.floors.length > 0) {
      for (const floor of lot.floors) {
        const [floorResult] = await connection.query<ResultSetHeader>(
          `INSERT INTO ParkingFloor 
          (Pk_Lot_ID, Floor_Number, Floor_Name, Total_Spots, Available_Spots)
          VALUES (?, ?, ?, ?, ?)`,
          [lotId, floor.floorNumber, floor.floorName, floor.total, floor.available]
        );

        const floorId = floorResult.insertId;

        // Insert floor features
        if (floor.features && floor.features.length > 0) {
          for (const feature of floor.features) {
            await connection.query(
              'INSERT INTO FloorFeatures (Floor_ID, Feature_Name) VALUES (?, ?)',
              [floorId, feature]
            );
          }
        }
      }
    }

    await connection.commit();
    return lotId;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

// Update a parking lot
export async function updateParkingLot(lotId: number, lot: Partial<ParkingLot>): Promise<boolean> {
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();

    const updates: string[] = [];
    const values: any[] = [];

    if (lot.name !== undefined) {
      updates.push('Lot_Name = ?');
      values.push(lot.name);
    }
    if (lot.address !== undefined) {
      updates.push('Address = ?');
      values.push(lot.address);
    }
    if (lot.distance !== undefined) {
      updates.push('Distance_From_Campus = ?');
      values.push(lot.distance);
    }
    if (lot.covered !== undefined) {
      updates.push('Covered = ?');
      values.push(lot.covered);
    }
    if (lot.price !== undefined) {
      const dailyRate = parseFloat(lot.price.replace(/[^0-9.]/g, ''));
      updates.push('Daily_Rate = ?');
      values.push(dailyRate);
    }
    if (lot.hourlyRate !== undefined) {
      const hourlyRate = parseFloat(lot.hourlyRate.replace(/[^0-9.]/g, ''));
      updates.push('Hourly_Rate = ?');
      values.push(hourlyRate);
    }
    if (lot.image !== undefined) {
      updates.push('Image_URL = ?');
      values.push(lot.image);
    }
    if (lot.lat !== undefined) {
      updates.push('Latitude = ?');
      values.push(lot.lat);
    }
    if (lot.lng !== undefined) {
      updates.push('Longitude = ?');
      values.push(lot.lng);
    }
    if (lot.available !== undefined) {
      updates.push('Available_Spots = ?');
      values.push(lot.available);
    }
    if (lot.total !== undefined) {
      updates.push('Total_Spots = ?');
      values.push(lot.total);
    }

    if (updates.length > 0) {
      values.push(lotId);
      await connection.query(
        `UPDATE ParkingLot SET ${updates.join(', ')} WHERE Pk_Lot_ID = ?`,
        values
      );
    }

    await connection.commit();
    return true;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

// Delete a parking lot
export async function deleteParkingLot(lotId: number): Promise<boolean> {
  const [result] = await pool.query<ResultSetHeader>(
    'DELETE FROM ParkingLot WHERE Pk_Lot_ID = ?',
    [lotId]
  );

  return result.affectedRows > 0;
}

// Update spot availability
export async function updateSpotAvailability(
  spotId: number,
  isOccupied: boolean
): Promise<boolean> {
  const [result] = await pool.query<ResultSetHeader>(
    'UPDATE ParkingSpot SET Is_Occupied = ? WHERE Pk_Spot_ID = ?',
    [isOccupied, spotId]
  );

  return result.affectedRows > 0;
}
