USE PNWPARKING;

-- SET SQL_SAFE_UPDATES = 0; 
-- DELETE FROM ParkingFloorFeatures;
-- DELETE FROM ParkingFloor;
-- DELETE FROM ParkingLot;
-- DELETE FROM CampusUser;
-- DELETE FROM Campus;
-- DELETE FROM Account;
-- SET SQL_SAFE_UPDATES = 1;

INSERT INTO Account (Account_Email, Verified, First_Name, Last_Name, Service_Permissions, Password)
VALUES ('admin@pnw.edu', TRUE, 'Admin', 'User', 'admin', '123456789');

INSERT INTO Campus (Campus_Name, Campus_Short_Name, Campus_Description, Domain, Icon_URL, Video_URL)
VALUES ('Purdue University Northwest', 'PNW', 'Rooted in Northwest Indiana, Purdue University Northwest (PNW) is a student-centered university transforming lives with innovative education.', 'pnw.edu', "https://www.pnw.edu/marketing-communications/wp-content/uploads/sites/9/2020/03/PNW_-V_WG-01_264x116.jpg", "https://www.pnw.edu/wp-content/uploads/2025/01/PNW_Website-Header-B_ELQ3.mp4");

SET @pnw_campus_id = LAST_INSERT_ID();

-- Sample Parking Lots
INSERT INTO ParkingLot (Pk_Campus_ID, Lot_Name, Address, Latitude, Longitude)
VALUES 
(@pnw_campus_id, 'Central Campus Garage', '123 University Ave', 41.580083, -87.472973),
(@pnw_campus_id, 'Peregrine East Lot', '456 College St', 41.580085, -87.471805),
(@pnw_campus_id, 'Peregrine South Lot', '789 Athletic Dr', 41.579703, -87.472422);

SET @garage_id = 1;
SET @east_lot_id = 2;
SET @south_lot_id = 3;

INSERT INTO ParkingFloor (Pk_Lot_ID, Floor_Number, Floor_Name, Total_Spots, Available_Spots) VALUES
(@garage_id, 1, 'Ground Floor', 30, 5),
(@garage_id, 2, 'Level 2', 40, 12),
(@garage_id, 3, 'Level 3', 40, 7),
(@garage_id, 4, 'Roof', 40, 0);

UPDATE ParkingLot SET Total_Spots = 150, Available_Spots = 24 WHERE Pk_Lot_ID = @garage_id;
UPDATE ParkingLot SET Total_Spots = 200, Available_Spots = 48 WHERE Pk_Lot_ID = @east_lot_id;
UPDATE ParkingLot SET Total_Spots = 500, Available_Spots = 156 WHERE Pk_Lot_ID = @south_lot_id;

-- Insert Parking Lots
INSERT INTO ParkingLot (Pk_Campus_ID, Lot_Name, Address, Distance_From_Campus, Daily_Rate, Hourly_Rate, Latitude, Longitude, Total_Spots, Available_Spots) VALUES
(@pnw_campus_id, 'Peregrine West Lot', '123 University Ave', '0.2 miles', 5.00, 2.00, 41.580083, -87.472973, 150, 24),
(@pnw_campus_id, 'Peregrine East Lot', '456 College St', '0.5 miles', 3.00, 1.50, 41.580085, -87.471805, 200, 48),
(@pnw_campus_id, 'Peregrine South Lot', '789 Athletic Dr', '0.8 miles', 2.00, 1.00, 41.579703, -87.472422, 500, 156),
(@pnw_campus_id, 'Griffin Lot', '789 Athletic Dr', '0.8 miles', 2.00, 1.00, 41.580203, -87.471360, 500, 156),
(@pnw_campus_id, 'NorthEast Lot', '789 Athletic Dr', '0.8 miles', 2.00, 1.00, 41.586884, -87.471931, 500, 156),
(@pnw_campus_id, 'EastSide Lot', '789 Athletic Dr', '0.8 miles', 2.00, 1.00, 41.586148, -87.471669, 500, 156),
(@pnw_campus_id, 'CLO/ANDERSON Lot', '789 Athletic Dr', '0.8 miles', 2.00, 1.00, 41.586614, -87.474168, 500, 156),
(@pnw_campus_id, 'Porter Lot', '789 Athletic Dr', '0.8 miles', 2.00, 1.00, 41.586283, -87.472905, 500, 156),
(@pnw_campus_id, 'NILS Main Lot', '789 Athletic Dr', '0.8 miles', 2.00, 1.00, 41.582502, -87.474121, 500, 156),
(@pnw_campus_id, 'Parking Garage', '789 Athletic Dr', '0.8 miles', 2.00, 1.00, 41.585347065461114, -87.47211545692153, 500, 156),
(@pnw_campus_id, 'NILS South Lot', '789 Athletic Dr', '0.8 miles', 2.00, 1.00, 41.581664606392415, -87.4742623411903, 500, 156),
(@pnw_campus_id, 'LAWSHE Lot', '789 Athletic Dr', '0.8 miles', 2.00, 1.00, 41.581723952443994, -87.47538588450159, 500, 156),
(@pnw_campus_id, 'PNRC Parking Lot', '789 Athletic Dr', '0.8 miles', 2.00, 1.00, 41.58029797565626, -87.47513234013597, 500, 156),
(@pnw_campus_id, 'R Riley Center Parking Lot', '789 Athletic Dr', '0.8 miles', 2.00, 1.00, 41.57940663881151, -87.47472392843363, 500, 156);

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


-- Wrong, should reference Parking Floor.
-- Insert Features for single-level lots
INSERT INTO ParkingFloorFeatures (Pk_Lot_ID, Feature_Name) VALUES
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