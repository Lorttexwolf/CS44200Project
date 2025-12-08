-- Insert Parking Lot Data from Map
-- Run this after running schema.sql

USE PNWPARKING;

-- Ensure we have a campus (using the sample campus from schema.sql or create one)
-- If you need to create a campus first, uncomment and modify these lines:
-- INSERT INTO Account (Account_Email, Verified, First_Name, Last_Name, Service_Permissions, Password_Hash)
-- VALUES ('campus@purduenw.edu', TRUE, 'Campus', 'Admin', 'campus_admin', '$2b$10$samplehashedpassword')
-- ON DUPLICATE KEY UPDATE Account_Email = Account_Email;

-- INSERT INTO Campus (Pk_Campus_Email, Pk_User_Email, Verified, Campus_Permissions, Campus_Name, Email_Domain)
-- VALUES ('campus@purduenw.edu', 'campus@purduenw.edu', TRUE, 'premium', 'Purdue University Northwest', 'purduenw.edu')
-- ON DUPLICATE KEY UPDATE Pk_Campus_Email = Pk_Campus_Email;

-- Get the campus ID (assumes campus already exists from schema.sql)
SET @campus_id = (SELECT Pk_Campus_ID FROM Campus LIMIT 1);

-- Disable safe update mode temporarily
SET SQL_SAFE_UPDATES = 0;

-- Clear existing parking lot data (optional - comment out if you want to keep existing data)
-- Note: Only delete from tables that exist. If running this on a fresh database, these tables might not exist yet.
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;

-- Delete in order of foreign key dependencies (child tables first)
DELETE FROM Reserved WHERE Reservation_ID > 0 OR Reservation_ID = 0;
DELETE FROM ParkingSpotOccupationalRecord WHERE Record_ID > 0 OR Record_ID = 0;
DELETE FROM ParkingSpot WHERE Pk_Spot_ID > 0 OR Pk_Spot_ID = 0;
DELETE FROM FloorFeatures WHERE Feature_ID > 0 OR Feature_ID = 0;
DELETE FROM ParkingFloor WHERE Floor_ID > 0 OR Floor_ID = 0;
DELETE FROM ParkingLotFeatures WHERE Feature_ID > 0 OR Feature_ID = 0;
DELETE FROM ParkingLot WHERE Pk_Lot_ID > 0 OR Pk_Lot_ID = 0;

SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;

-- Re-enable safe update mode
SET SQL_SAFE_UPDATES = 1;

-- Reset auto-increment
ALTER TABLE ParkingLot AUTO_INCREMENT = 1;

-- Insert Parking Lots
INSERT INTO ParkingLot (Pk_Campus_ID, Lot_Name, Address, Distance_From_Campus, Covered, Daily_Rate, Hourly_Rate, Latitude, Longitude, Has_Multiple_Floors, Total_Spots, Available_Spots) VALUES
(@campus_id, 'Peregrine West Lot', '123 University Ave', '0.2 miles', FALSE, 5.00, 2.00, 41.580083, -87.472973, FALSE, 150, 24),
(@campus_id, 'Peregrine East Lot', '456 College St', '0.5 miles', FALSE, 3.00, 1.50, 41.580085, -87.471805, FALSE, 200, 48),
(@campus_id, 'Peregrine South Lot', '789 Athletic Dr', '0.8 miles', FALSE, 2.00, 1.00, 41.579703, -87.472422, FALSE, 500, 156),
(@campus_id, 'Griffin Lot', '789 Athletic Dr', '0.8 miles', FALSE, 2.00, 1.00, 41.580203, -87.471360, FALSE, 500, 156),
(@campus_id, 'NorthEast Lot', '789 Athletic Dr', '0.8 miles', FALSE, 2.00, 1.00, 41.586884, -87.471931, FALSE, 500, 156),
(@campus_id, 'EastSide Lot', '789 Athletic Dr', '0.8 miles', FALSE, 2.00, 1.00, 41.586148, -87.471669, FALSE, 500, 156),
(@campus_id, 'CLO/ANDERSON Lot', '789 Athletic Dr', '0.8 miles', FALSE, 2.00, 1.00, 41.586614, -87.474168, FALSE, 500, 156),
(@campus_id, 'Porter Lot', '789 Athletic Dr', '0.8 miles', FALSE, 2.00, 1.00, 41.586283, -87.472905, FALSE, 500, 156),
(@campus_id, 'NILS Main Lot', '789 Athletic Dr', '0.8 miles', FALSE, 2.00, 1.00, 41.582502, -87.474121, FALSE, 500, 156),
(@campus_id, 'Parking Garage', '789 Athletic Dr', '0.8 miles', TRUE, 2.00, 1.00, 41.585347065461114, -87.47211545692153, TRUE, 500, 156),
(@campus_id, 'NILS South Lot', '789 Athletic Dr', '0.8 miles', FALSE, 2.00, 1.00, 41.581664606392415, -87.4742623411903, FALSE, 500, 156),
(@campus_id, 'LAWSHE Lot', '789 Athletic Dr', '0.8 miles', FALSE, 2.00, 1.00, 41.581723952443994, -87.47538588450159, FALSE, 500, 156),
(@campus_id, 'PNRC Parking Lot', '789 Athletic Dr', '0.8 miles', FALSE, 2.00, 1.00, 41.58029797565626, -87.47513234013597, FALSE, 500, 156),
(@campus_id, 'R Riley Center Parking Lot', '789 Athletic Dr', '0.8 miles', FALSE, 2.00, 1.00, 41.57940663881151, -87.47472392843363, FALSE, 500, 156);

-- Get lot IDs for features
SET @peregrine_west_id = 1;
SET @peregrine_east_id = 2;
SET @peregrine_south_id = 3;
SET @griffin_id = 4;
SET @clo_anderson_id = 7;
SET @porter_id = 8;
SET @nils_main_id = 9;
SET @parking_garage_id = 10;
SET @pnrc_id = 13;

-- Insert Features for single-level lots
INSERT INTO ParkingLotFeatures (Pk_Lot_ID, Feature_Name) VALUES
-- Peregrine East Lot
(@peregrine_east_id, 'Well-Lit'),
(@peregrine_east_id, 'Security Cameras'),

-- Peregrine South Lot
(@peregrine_south_id, 'Accessible'),
(@peregrine_south_id, 'EV Charging'),

-- Griffin Lot
(@griffin_id, 'Visitor Parking'),
(@griffin_id, 'Bike Racks'),

-- CLO/ANDERSON Lot
(@clo_anderson_id, 'EV Charging'),

-- Porter Lot
(@porter_id, 'EV Charging'),

-- NILS Main Lot
(@nils_main_id, 'EV Charging'),

-- PNRC Parking Lot
(@pnrc_id, 'EV Charging');

-- Insert Floors for Parking Garage
INSERT INTO ParkingFloor (Pk_Lot_ID, Floor_Number, Floor_Name, Total_Spots, Available_Spots) VALUES
(@parking_garage_id, 1, 'Ground Floor', 100, 20),
(@parking_garage_id, 2, 'Level 2', 100, 45),
(@parking_garage_id, 3, 'Level 3', 150, 56),
(@parking_garage_id, 4, 'Level 4', 150, 35);

-- Get floor IDs for features
SET @floor1_id = LAST_INSERT_ID();
SET @floor2_id = @floor1_id + 1;
SET @floor3_id = @floor1_id + 2;
SET @floor4_id = @floor1_id + 3;

-- Insert Floor Features
INSERT INTO FloorFeatures (Floor_ID, Feature_Name) VALUES
-- Ground Floor
(@floor1_id, 'Accessible'),

-- Level 2
(@floor2_id, 'Covered'),

-- Level 3
(@floor3_id, 'Covered'),
(@floor3_id, 'EV Charging'),

-- Level 4
(@floor4_id, 'Covered');

-- Update Parking Garage total to match floors
UPDATE ParkingLot 
SET Total_Spots = 500, Available_Spots = 156 
WHERE Pk_Lot_ID = @parking_garage_id;

-- Verify data
SELECT 
    pl.Lot_Name,
    pl.Latitude,
    pl.Longitude,
    pl.Total_Spots,
    pl.Available_Spots,
    pl.Covered,
    pl.Has_Multiple_Floors,
    GROUP_CONCAT(DISTINCT plf.Feature_Name SEPARATOR ', ') as Features
FROM ParkingLot pl
LEFT JOIN ParkingLotFeatures plf ON pl.Pk_Lot_ID = plf.Pk_Lot_ID
GROUP BY pl.Pk_Lot_ID
ORDER BY pl.Pk_Lot_ID;

-- Show parking garage floors
SELECT 
    pl.Lot_Name,
    pf.Floor_Name,
    pf.Available_Spots,
    pf.Total_Spots,
    GROUP_CONCAT(ff.Feature_Name SEPARATOR ', ') as Features
FROM ParkingLot pl
JOIN ParkingFloor pf ON pl.Pk_Lot_ID = pf.Pk_Lot_ID
LEFT JOIN FloorFeatures ff ON pf.Floor_ID = ff.Floor_ID
WHERE pl.Has_Multiple_Floors = TRUE
GROUP BY pf.Floor_ID
ORDER BY pl.Pk_Lot_ID, pf.Floor_Number;