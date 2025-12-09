import pool from './db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

// Get all parking lots for a campus
export async function getParkingLots(campusId: number) {
  const [lots] = await pool.query<RowDataPacket[]>(
    `SELECT 
      pl.Pk_Lot_ID as id,
      pl.Lot_Name as name,
      pl.Address as address,
      pl.Image_URL as image,
      pl.Latitude as latitude,
      pl.Longitude as longitude,
      pl.Pk_Campus_ID as campusId
    FROM ParkingLot pl
    WHERE pl.Pk_Campus_ID = ?`,
    [campusId]
  );

  const result = [];

  for (const lot of lots) {
    // Get all floors for this lot
    const [floors] = await pool.query<RowDataPacket[]>(
      `SELECT 
        pf.Floor_ID as id,
        pf.Floor_Number as floor,
        pf.Floor_Name as floorName,
        pf.Total_Spots as totalSpots,
        pf.Available_Spots as availableSpots,
        pf.Created_At as createdAt
      FROM ParkingFloor pf
      WHERE pf.Pk_Lot_ID = ?
      ORDER BY pf.Floor_Number`,
      [lot.id]
    );

    // Get features for each floor
    const floorsWithFeatures = await Promise.all(
      floors.map(async (floor) => {
        const [features] = await pool.query<RowDataPacket[]>(
          `SELECT Feature_Name 
           FROM ParkingFloorFeatures 
           WHERE Fk_Floor_ID = ?`,
          [floor.id]
        );

        return {
          id: floor.id,
          floor: floor.floor,
          floorName: floor.floorName,
          totalSpots: floor.totalSpots,
          availableSpots: floor.availableSpots,
          createdAt: floor.createdAt,
          features: features.map((f) => f.Feature_Name),
        };
      })
    );

    // Calculate total and available spots from all floors
    const totalSpots = floorsWithFeatures.reduce((sum, f) => sum + f.totalSpots, 0);
    const availableSpots = floorsWithFeatures.reduce((sum, f) => sum + f.availableSpots, 0);

    result.push({
      id: lot.id,
      name: lot.name,
      address: lot.address,
      image: lot.image,
      latitude: lot.latitude,
      longitude: lot.longitude,
      campusId: lot.campusId,
      totalSpots,
      availableSpots,
      floors: floorsWithFeatures,
    });
  }

  return result;
}

// Get a single parking lot by ID
export async function getParkingLotById(lotId: number) {
  const [lots] = await pool.query<RowDataPacket[]>(
    `SELECT 
      pl.Pk_Lot_ID as id,
      pl.Lot_Name as name,
      pl.Address as address,
      pl.Image_URL as image,
      pl.Latitude as latitude,
      pl.Longitude as longitude,
      pl.Pk_Campus_ID as campusId
    FROM ParkingLot pl
    WHERE pl.Pk_Lot_ID = ?`,
    [lotId]
  );

  if (lots.length === 0) return null;

  const lot = lots[0];

  // Get all floors for this lot
  const [floors] = await pool.query<RowDataPacket[]>(
    `SELECT 
      pf.Floor_ID as id,
      pf.Floor_Number as floor,
      pf.Floor_Name as floorName,
      pf.Total_Spots as totalSpots,
      pf.Available_Spots as availableSpots,
      pf.Created_At as createdAt
    FROM ParkingFloor pf
    WHERE pf.Pk_Lot_ID = ?
    ORDER BY pf.Floor_Number`,
    [lot.id]
  );

  // Get features for each floor
  const floorsWithFeatures = await Promise.all(
    floors.map(async (floor) => {
      const [features] = await pool.query<RowDataPacket[]>(
        `SELECT Feature_Name 
         FROM ParkingFloorFeatures 
         WHERE Fk_Floor_ID = ?`,
        [floor.id]
      );

      return {
        id: floor.id,
        floor: floor.floor,
        floorName: floor.floorName,
        totalSpots: floor.totalSpots,
        availableSpots: floor.availableSpots,
        createdAt: floor.createdAt,
        features: features.map((f) => f.Feature_Name),
      };
    })
  );

  // Calculate total and available spots from all floors
  const totalSpots = floorsWithFeatures.reduce((sum, f) => sum + f.totalSpots, 0);
  const availableSpots = floorsWithFeatures.reduce((sum, f) => sum + f.availableSpots, 0);

  return {
    id: lot.id,
    name: lot.name,
    address: lot.address,
    image: lot.image,
    latitude: lot.latitude,
    longitude: lot.longitude,
    campusId: lot.campusId,
    totalSpots,
    availableSpots,
    floors: floorsWithFeatures,
  };
}
