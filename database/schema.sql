CREATE DATABASE IF NOT EXISTS PNWPARKING;
USE PNWPARKING;

CREATE TABLE Account (
    Account_Email VARCHAR(255) PRIMARY KEY,
    Verified BOOLEAN DEFAULT FALSE,
    First_Name VARCHAR(100) NOT NULL,
    Last_Name VARCHAR(100) NOT NULL,
    Service_Permissions ENUM('user', 'admin', 'campus_admin') DEFAULT 'user',
    Password_Hash VARCHAR(255) NOT NULL,
    Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Updated_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE PasswordResetCodes (
    Pk_Account_Email VARCHAR(255) PRIMARY KEY,
    Code VARCHAR(10) NOT NULL,
    Issued_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Expires_At TIMESTAMP NOT NULL,
    Used BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (Pk_Account_Email) REFERENCES Account(Account_Email) ON DELETE CASCADE ON UPDATE CASCADE,
);

CREATE TABLE AccountEmailVerification (
    Pk_Account_Email VARCHAR(255) PRIMARY KEY,
    Code VARCHAR(10) NOT NULL,
    Issued_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Expires_At TIMESTAMP NOT NULL,
    FOREIGN KEY (Pk_Account_Email) REFERENCES Account(Account_Email) 
        ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX idx_code (Code),
    INDEX idx_expires_at (Expires_At)
);

CREATE TABLE Campus (
    Pk_Campus_ID INT AUTO_INCREMENT PRIMARY KEY,
    Verified BOOLEAN DEFAULT FALSE,
    Campus_Name VARCHAR(255) NOT NULL,
    Campus_Short_Name VARCHAR(255) NOT NULL UNIQUE,
    Campus_Description VARCHAR(1000) NOT NULL,
    Icon_URL VARCHAR(500) NOT NULL,
    Video_URL VARCHAR(500),
    Domain VARCHAR(255) NOT NULL,
    Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Updated_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (Pk_User_Email) REFERENCES Account(Account_Email) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE CampusUser (
    Pk_Campus_Email VARCHAR(255),
    Pk_User_Email VARCHAR(255),
    Verified BOOLEAN DEFAULT FALSE,
    Campus_Permissions ENUM('user', 'moderator', 'admin') DEFAULT 'user',
    Joined_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (Pk_Campus_Email, Pk_User_Email),
    FOREIGN KEY (Pk_Campus_Email) REFERENCES Campus(Pk_Campus_Email) 
        ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (Pk_User_Email) REFERENCES Account(Account_Email) 
        ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX idx_user_email (Pk_User_Email),
    INDEX idx_verified (Verified)
);

CREATE TABLE ParkingLot (
    Pk_Lot_ID INT AUTO_INCREMENT PRIMARY KEY,
    Pk_Campus_ID INT NOT NULL,
    Lot_Name VARCHAR(255) NOT NULL,
    Address VARCHAR(500),
    Distance_From_Campus VARCHAR(50),
    Covered BOOLEAN DEFAULT FALSE,
    Daily_Rate DECIMAL(10, 2),
    Hourly_Rate DECIMAL(10, 2),
    Image_URL VARCHAR(500),
    Latitude DECIMAL(10, 8) NOT NULL,
    Longitude DECIMAL(11, 8) NOT NULL,
    Total_Spots INT NOT NULL DEFAULT 0,
    Available_Spots INT NOT NULL DEFAULT 0,
    Has_Multiple_Floors BOOLEAN DEFAULT FALSE,
    Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Updated_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (Pk_Campus_ID) REFERENCES Campus(Pk_Campus_ID) 
        ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX idx_campus_id (Pk_Campus_ID),
    INDEX idx_location (Latitude, Longitude),
    INDEX idx_availability (Available_Spots),
    INDEX idx_has_multiple_floors (Has_Multiple_Floors)
);

CREATE TABLE ParkingLotFeatures (
    Feature_ID INT AUTO_INCREMENT PRIMARY KEY,
    Pk_Lot_ID INT NOT NULL,
    Feature_Name VARCHAR(100) NOT NULL,
    Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (Pk_Lot_ID) REFERENCES ParkingLot(Pk_Lot_ID) 
        ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX idx_lot_id (Pk_Lot_ID),
    INDEX idx_feature_name (Feature_Name)
);

CREATE TABLE ParkingFloor (
    Floor_ID INT AUTO_INCREMENT PRIMARY KEY,
    Pk_Lot_ID INT NOT NULL,
    Floor_Number INT NOT NULL,
    Floor_Name VARCHAR(100) NOT NULL,
    Total_Spots INT NOT NULL DEFAULT 0,
    Available_Spots INT NOT NULL DEFAULT 0,
    Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Updated_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (Pk_Lot_ID) REFERENCES ParkingLot(Pk_Lot_ID) 
        ON DELETE CASCADE ON UPDATE CASCADE,
    UNIQUE KEY unique_floor_per_lot (Pk_Lot_ID, Floor_Number),
    INDEX idx_lot_id (Pk_Lot_ID),
    INDEX idx_floor_number (Floor_Number),
    INDEX idx_availability (Available_Spots)
);

CREATE TABLE FloorFeatures (
    Feature_ID INT AUTO_INCREMENT PRIMARY KEY,
    Floor_ID INT NOT NULL,
    Feature_Name VARCHAR(100) NOT NULL,
    Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (Floor_ID) REFERENCES ParkingFloor(Floor_ID) 
        ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX idx_floor_id (Floor_ID),
    INDEX idx_feature_name (Feature_Name)
);

-- -- Parking Spot table (enhanced with floor support)
-- CREATE TABLE ParkingSpot (
--     Pk_Spot_ID INT AUTO_INCREMENT PRIMARY KEY,
--     Pk_Lot_ID INT NOT NULL,
--     Floor_ID INT NULL, -- NULL for single-level lots
--     Spot_Number VARCHAR(50) NOT NULL,
--     Longitude DECIMAL(11, 8),
--     Latitude DECIMAL(10, 8),
--     Is_Occupied BOOLEAN DEFAULT FALSE,
--     Spot_Type ENUM('standard', 'accessible', 'ev_charging', 'compact', 'motorcycle') DEFAULT 'standard',
--     Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     Updated_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
--     FOREIGN KEY (Pk_Lot_ID) REFERENCES ParkingLot(Pk_Lot_ID) 
--         ON DELETE CASCADE ON UPDATE CASCADE,
--     FOREIGN KEY (Floor_ID) REFERENCES ParkingFloor(Floor_ID) 
--         ON DELETE SET NULL ON UPDATE CASCADE,
--     UNIQUE KEY unique_spot_per_lot (Pk_Lot_ID, Spot_Number),
--     INDEX idx_lot_id (Pk_Lot_ID),
--     INDEX idx_floor_id (Floor_ID),
--     INDEX idx_occupied (Is_Occupied),
--     INDEX idx_spot_type (Spot_Type)
-- );

-- -- Parking Spot Occupational Record
-- CREATE TABLE ParkingSpotOccupationalRecord (
--     Record_ID INT AUTO_INCREMENT PRIMARY KEY,
--     Pk_Spot_ID INT NOT NULL,
--     Time_Changed TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     Time_Updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
--     Occupied BOOLEAN NOT NULL,
--     FOREIGN KEY (Pk_Spot_ID) REFERENCES ParkingSpot(Pk_Spot_ID) 
--         ON DELETE CASCADE ON UPDATE CASCADE,
--     INDEX idx_spot_id (Pk_Spot_ID),
--     INDEX idx_time_changed (Time_Changed),
--     INDEX idx_occupied (Occupied)
-- );

-- CREATE TABLE Reserved (
--     Reservation_ID INT AUTO_INCREMENT PRIMARY KEY,
--     Reason VARCHAR(500),
--     Start_Time TIMESTAMP NOT NULL,
--     End_Time TIMESTAMP NOT NULL,
--     Status ENUM('active', 'completed', 'cancelled') DEFAULT 'active',
--     Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     Updated_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
--     INDEX idx_dates (Start_Date, End_Date),
--     INDEX idx_status (Status)

-- );

-- =====================================================
-- Triggers for maintaining availability counts
-- =====================================================

-- Trigger to update floor availability when spot occupancy changes
DELIMITER //

-- Trigger to update parking lot availability when floor changes
CREATE TRIGGER update_lot_availability_after_floor_update
AFTER UPDATE ON ParkingFloor
FOR EACH ROW
BEGIN
    UPDATE ParkingLot
    SET Available_Spots = (
        SELECT SUM(Available_Spots) 
        FROM ParkingFloor 
        WHERE Pk_Lot_ID = NEW.Pk_Lot_ID
    )
    WHERE Pk_Lot_ID = NEW.Pk_Lot_ID;
END//

DELIMITER ;

-- =====================================================
-- Views for common queries
-- =====================================================

-- View for parking lot summary with features
CREATE VIEW ParkingLotSummary AS
SELECT 
    pl.Pk_Lot_ID,
    pl.Lot_Name,
    pl.Address,
    pl.Covered,
    pl.Daily_Rate,
    pl.Hourly_Rate,
    pl.Latitude,
    pl.Longitude,
    pl.Total_Spots,
    pl.Available_Spots,
    pl.Has_Multiple_Floors,
    c.Campus_Name,
    GROUP_CONCAT(DISTINCT plf.Feature_Name SEPARATOR ', ') AS Features
FROM ParkingLot pl
JOIN Campus c ON pl.Pk_Campus_ID = c.Pk_Campus_ID
LEFT JOIN ParkingLotFeatures plf ON pl.Pk_Lot_ID = plf.Pk_Lot_ID
GROUP BY pl.Pk_Lot_ID;

-- View for floor details with features
CREATE VIEW FloorDetailView AS
SELECT 
    pf.Floor_ID,
    pf.Pk_Lot_ID,
    pf.Floor_Number,
    pf.Floor_Name,
    pf.Total_Spots,
    pf.Available_Spots,
    ROUND((pf.Available_Spots / pf.Total_Spots) * 100, 2) AS Availability_Percentage,
    pl.Lot_Name,
    GROUP_CONCAT(DISTINCT ff.Feature_Name SEPARATOR ', ') AS Floor_Features
FROM ParkingFloor pf
JOIN ParkingLot pl ON pf.Pk_Lot_ID = pl.Pk_Lot_ID
LEFT JOIN FloorFeatures ff ON pf.Floor_ID = ff.Floor_ID
GROUP BY pf.Floor_ID;

-- View for active reservations
-- CREATE VIEW ActiveReservations AS
-- SELECT 
--     r.Reservation_ID,
--     r.Pk_User_Email,
--     a.First_Name,
--     a.Last_Name,
--     ps.Spot_Number,
--     pl.Lot_Name,
--     pf.Floor_Name,
--     r.Start_Time,
--     r.End_Time,
--     r.Status
-- FROM Reserved r
-- JOIN Account a ON r.Pk_User_Email = a.Account_Email
-- JOIN ParkingSpot ps ON r.Pk_Parking_Spot_ID = ps.Pk_Spot_ID
-- JOIN ParkingLot pl ON ps.Pk_Lot_ID = pl.Pk_Lot_ID
-- LEFT JOIN ParkingFloor pf ON ps.Floor_ID = pf.Floor_ID
-- WHERE r.Status = 'active';

-- =====================================================
-- Sample Data Insertion
-- =====================================================

-- Sample Account
INSERT INTO Account (Account_Email, Verified, First_Name, Last_Name, Service_Permissions, Password_Hash)
VALUES ('admin@pnw.edu', TRUE, 'Admin', 'User', 'admin', '$2b$10$samplehashedpassword');

-- Sample Campus
INSERT INTO Campus (Pk_Campus_Email, Pk_User_Email, Verified, Campus_Permissions, Campus_Name, Campus_Short_Name, Campus_Description, Email_Domain)
VALUES ('campus@purduenw.edu', 'admin@pnw.edu', TRUE, 'premium', 'Purdue University Northwest', 'PNW', 'Rooted in Northwest Indiana, Purdue University Northwest (PNW) is a student-centered university transforming lives with innovative education.', 'pnw.edu');

-- Get the campus ID
SET @campus_id = LAST_INSERT_ID();

-- Sample Parking Lots
INSERT INTO ParkingLot (Pk_Campus_ID, Lot_Name, Address, Distance_From_Campus, Covered, Daily_Rate, Hourly_Rate, Latitude, Longitude, Has_Multiple_Floors)
VALUES 
(@campus_id, 'Central Campus Garage', '123 University Ave', '0.2 miles', TRUE, 5.00, 2.00, 41.580083, -87.472973, TRUE),
(@campus_id, 'Peregrine East Lot', '456 College St', '0.5 miles', FALSE, 3.00, 1.50, 41.580085, -87.471805, FALSE),
(@campus_id, 'Peregrine South Lot', '789 Athletic Dr', '0.8 miles', FALSE, 2.00, 1.00, 41.579703, -87.472422, FALSE);

-- Get parking lot IDs
SET @garage_id = 1;
SET @east_lot_id = 2;
SET @south_lot_id = 3;

-- Features for single-level lots
INSERT INTO ParkingLotFeatures (Pk_Lot_ID, Feature_Name) VALUES
(@east_lot_id, 'Well-Lit'),
(@east_lot_id, 'Security Cameras'),
(@south_lot_id, 'Accessible'),
(@south_lot_id, 'EV Charging');

-- Floors for Central Campus Garage
INSERT INTO ParkingFloor (Pk_Lot_ID, Floor_Number, Floor_Name, Total_Spots, Available_Spots) VALUES
(@garage_id, 1, 'Ground Floor', 30, 5),
(@garage_id, 2, 'Level 2', 40, 12),
(@garage_id, 3, 'Level 3', 40, 7),
(@garage_id, 4, 'Roof', 40, 0);

-- Floor features
INSERT INTO FloorFeatures (Floor_ID, Feature_Name) VALUES
(1, 'Accessible'),
(1, 'EV Charging'),
(2, 'Covered'),
(3, 'Covered'),
(4, 'Open Air');

-- Update parking lot total counts
UPDATE ParkingLot SET Total_Spots = 150, Available_Spots = 24 WHERE Pk_Lot_ID = @garage_id;
UPDATE ParkingLot SET Total_Spots = 200, Available_Spots = 48 WHERE Pk_Lot_ID = @east_lot_id;
UPDATE ParkingLot SET Total_Spots = 500, Available_Spots = 156 WHERE Pk_Lot_ID = @south_lot_id;
