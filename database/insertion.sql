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

-- Insert Parking Lots
INSERT INTO ParkingLot (Pk_Campus_ID, Lot_Name, Address, Latitude, Longitude) VALUES
(@pnw_campus_id, 'Peregrine West Lot', '123 University Ave', 41.580083, -87.472973),
(@pnw_campus_id, 'Peregrine East Lot', '456 College St', 41.580085, -87.471805),
(@pnw_campus_id, 'Peregrine South Lot', '789 Athletic Dr', 41.579703, -87.472422),
(@pnw_campus_id, 'Griffin Lot', '789 Athletic Dr', 41.580203, -87.471360),
(@pnw_campus_id, 'NorthEast Lot', '789 Athletic Dr', 41.586884, -87.471931),
(@pnw_campus_id, 'EastSide Lot', '789 Athletic Dr', 41.586148, -87.471669),
(@pnw_campus_id, 'CLO/ANDERSON Lot', '789 Athletic Dr', 41.586614, -87.474168),
(@pnw_campus_id, 'Porter Lot', '789 Athletic Dr', 41.586283, -87.472905),
(@pnw_campus_id, 'NILS Main Lot', '789 Athletic Dr', 41.582502, -87.474121),
(@pnw_campus_id, 'Parking Garage', '789 Athletic Dr', 41.585347065461114, -87.47211545692153),
(@pnw_campus_id, 'NILS South Lot', '789 Athletic Dr', 41.581664606392415, -87.4742623411903),
(@pnw_campus_id, 'LAWSHE Lot', '789 Athletic Dr', 41.581723952443994, -87.47538588450159),
(@pnw_campus_id, 'PNRC Parking Lot', '789 Athletic Dr', 41.58029797565626, -87.47513234013597),
(@pnw_campus_id, 'R Riley Center Parking Lot', '789 Athletic Dr', 41.57940663881151, -87.47472392843363);

-- Get lot IDs
SET @first_lot_id = LAST_INSERT_ID();

-- Insert 1 floor for all single-level lots (Floor_Number = 1 for ground level)
INSERT INTO ParkingFloor (Pk_Lot_ID, Floor_Number, Floor_Name, Total_Spots, Available_Spots) VALUES
-- Peregrine West Lot
(@first_lot_id, 1, 'Ground Level', 150, 24),
-- Peregrine East Lot
(@first_lot_id + 1, 1, 'Ground Level', 200, 48),
-- Peregrine South Lot
(@first_lot_id + 2, 1, 'Ground Level', 500, 156),
-- Griffin Lot
(@first_lot_id + 3, 1, 'Ground Level', 300, 75),
-- NorthEast Lot
(@first_lot_id + 4, 1, 'Ground Level', 250, 60),
-- EastSide Lot
(@first_lot_id + 5, 1, 'Ground Level', 180, 40),
-- CLO/ANDERSON Lot
(@first_lot_id + 6, 1, 'Ground Level', 120, 30),
-- Porter Lot
(@first_lot_id + 7, 1, 'Ground Level', 100, 25),
-- NILS Main Lot
(@first_lot_id + 8, 1, 'Ground Level', 400, 100),
-- NILS South Lot
(@first_lot_id + 10, 1, 'Ground Level', 350, 85),
-- LAWSHE Lot
(@first_lot_id + 11, 1, 'Ground Level', 200, 50),
-- PNRC Parking Lot
(@first_lot_id + 12, 1, 'Ground Level', 300, 70),
-- R Riley Center Parking Lot
(@first_lot_id + 13, 1, 'Ground Level', 150, 35);

-- Insert Floors for Parking Garage ONLY (multiple floors)
INSERT INTO ParkingFloor (Pk_Lot_ID, Floor_Number, Floor_Name, Total_Spots, Available_Spots) VALUES
(@first_lot_id + 9, 1, 'Ground Floor', 100, 20),
(@first_lot_id + 9, 2, 'Level 2', 100, 45),
(@first_lot_id + 9, 3, 'Level 3', 150, 56),
(@first_lot_id + 9, 4, 'Level 4', 150, 35);

-- Get floor IDs for Parking Garage features (the last 4 floors inserted)
SET @floor1_id = LAST_INSERT_ID();
SET @floor2_id = @floor1_id + 1;
SET @floor3_id = @floor1_id + 2;
SET @floor4_id = @floor1_id + 3;

-- Insert Floor Features (using ParkingFloorFeatures table which references Floor_ID)
INSERT INTO ParkingFloorFeatures (Fk_Floor_ID, Feature_Name) VALUES
-- Ground Floor
(@floor1_id, 'Accessible'),

-- Level 2
(@floor2_id, 'Covered'),

-- Level 3
(@floor3_id, 'Covered'),
(@floor3_id, 'EV Charging'),

-- Level 4
(@floor4_id, 'Covered');


-- Verify data
SELECT 
    pl.Lot_Name,
    pl.Latitude,
    pl.Longitude,
    COUNT(pf.Floor_ID) as Floor_Count
FROM ParkingLot pl
LEFT JOIN ParkingFloor pf ON pl.Pk_Lot_ID = pf.Pk_Lot_ID
GROUP BY pl.Pk_Lot_ID
ORDER BY pl.Pk_Lot_ID;

-- Show parking garage floors
SELECT 
    pl.Lot_Name,
    pf.Floor_Name,
    pf.Available_Spots,
    pf.Total_Spots,
    GROUP_CONCAT(pff.Feature_Name SEPARATOR ', ') as Features
FROM ParkingLot pl
JOIN ParkingFloor pf ON pl.Pk_Lot_ID = pf.Pk_Lot_ID
LEFT JOIN ParkingFloorFeatures pff ON pf.Floor_ID = pff.Fk_Floor_ID
GROUP BY pf.Floor_ID
ORDER BY pl.Pk_Lot_ID, pf.Floor_Number;
