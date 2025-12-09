-- Insert Parking Lots into PNW

INSERT INTO ParkingLot (Pk_Campus_ID, Lot_Name, Address, Latitude, Longitude, ImageFileName) VALUES
(@PNW_CAMPUS_ID, 'Peregrine West Lot', '123 University Ave', 41.580083, -87.472973, "1764671593747-WEST_parking.png"), -- Peregrine West Lot
(@PNW_CAMPUS_ID, 'Peregrine East Lot', '456 College St', 41.580085, -87.471805, "1764671639117-peregrineEAST.png"), -- Peregrine East Lot
(@PNW_CAMPUS_ID, 'Peregrine South Lot', '789 Athletic Dr', 41.579703, -87.472422, "1764671665309-parkin.png"), -- Peregrine South Lot
(@PNW_CAMPUS_ID, 'Griffin Lot', '789 Athletic Dr', 41.580203, -87.471360, "1764671676091-Griffin.png"), -- Griffin Lot
(@PNW_CAMPUS_ID, 'NorthEast Lot', '789 Athletic Dr', 41.586884, -87.471931, "1764671791641-NElot.png"),
(@PNW_CAMPUS_ID, 'EastSide Lot', '789 Athletic Dr', 41.586148, -87.471669, "1764671813699-EastSideLot.png"),
(@PNW_CAMPUS_ID, 'CLO/ANDERSON Lot', '789 Athletic Dr', 41.586614, -87.474168, "1764671828551-CLOANDERSON.png"),
(@PNW_CAMPUS_ID, 'Porter Lot', '789 Athletic Dr', 41.586283, -87.472905, "1764671837406-porter.png"),
(@PNW_CAMPUS_ID, 'NILS Main Lot', '789 Athletic Dr', 41.582502, -87.474121, "1764671846695-NILSLOT.jpg"),
(@PNW_CAMPUS_ID, 'Parking Garage', '789 Athletic Dr', 41.5849872, -87.4730492, "1764671855624-PGARAGE.png"),
(@PNW_CAMPUS_ID, 'NILS South Lot', '789 Athletic Dr', 41.581664606392415, -87.4742623411903, "1764671865844-NILSSOUTH.png"),
(@PNW_CAMPUS_ID, 'LAWSHE Lot', '789 Athletic Dr', 41.581723952443994, -87.47538588450159, "1764671879221-lawsheLTO.png"),
(@PNW_CAMPUS_ID, 'FNRC Parking Lot', '789 Athletic Dr', 41.58029797565626, -87.47513234013597, "1764672013930-FNRC.png"),
(@PNW_CAMPUS_ID, 'R Riley Center Parking Lot', '789 Athletic Dr', 41.57940663881151, -87.47472392843363, "1764672084226-hospital.png");

-- INSERT Parking Floors.

SET @FIRST_LOT_ID = LAST_INSERT_ID();

INSERT INTO ParkingFloor (Pk_Lot_ID, Floor_Number, Floor_Name, Total_Spots, Available_Spots) VALUES
(@FIRST_LOT_ID, 1, 'Ground Level', 150, 24), -- Peregrine West Lot
(@FIRST_LOT_ID + 1, 1, 'Ground Level', 200, 48), -- Peregrine East Lot
(@FIRST_LOT_ID + 2, 1, 'Ground Level', 500, 156), -- Peregrine South Lot
(@FIRST_LOT_ID + 3, 1, 'Ground Level', 300, 75), -- Griffin Lot
(@FIRST_LOT_ID + 4, 1, 'Ground Level', 250, 60), -- NorthEast Lot
(@FIRST_LOT_ID + 5, 1, 'Ground Level', 180, 40), -- EastSide Lot
(@FIRST_LOT_ID + 6, 1, 'Ground Level', 120, 30), -- CLO/ANDERSON Lot
(@FIRST_LOT_ID + 7, 1, 'Ground Level', 100, 25), -- Porter Lot
(@FIRST_LOT_ID + 8, 1, 'Ground Level', 400, 100), -- NILS Main Lot
(@FIRST_LOT_ID + 10, 1, 'Ground Level', 350, 85), -- NILS South Lot
(@FIRST_LOT_ID + 11, 1, 'Ground Level', 200, 50), -- LAWSHE Lot
(@FIRST_LOT_ID + 12, 1, 'Ground Level', 300, 70), -- PNRC Parking Lot
(@FIRST_LOT_ID + 13, 1, 'Ground Level', 150, 35); -- R Riley Center Parking Lot

-- Insert Floors for Parking Garage ONLY (multiple floors)
INSERT INTO ParkingFloor (Pk_Lot_ID, Floor_Number, Floor_Name, Total_Spots, Available_Spots) VALUES
(@FIRST_LOT_ID + 9, 1, 'Ground Floor', 100, 20),
(@FIRST_LOT_ID + 9, 2, 'Level 2', 100, 45),
(@FIRST_LOT_ID + 9, 3, 'Level 3', 150, 56),
(@FIRST_LOT_ID + 9, 4, 'Level 4', 150, 35);