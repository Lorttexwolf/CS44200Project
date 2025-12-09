CREATE DATABASE IF NOT EXISTS PNWPARKING;
USE PNWPARKING;

-- DROP TABLE IF EXISTS CampusEmailVerification;
-- DROP TABLE IF EXISTS ParkingLotFeatures;
-- DROP TABLE IF EXISTS ParkingFloorFeatures;
-- DROP TABLE IF EXISTS FloorFeatures;
-- DROP TABLE IF EXISTS ParkingFloor;
-- DROP TABLE IF EXISTS ParkingLot;
-- DROP TABLE IF EXISTS CampusUser;
-- DROP TABLE IF EXISTS Campus;
-- DROP TABLE IF EXISTS AccountEmailVerification;
-- DROP TABLE IF EXISTS PasswordResetCodes;
-- DROP TABLE IF EXISTS Account;

CREATE TABLE Account (
    Account_Email VARCHAR(255) PRIMARY KEY,
    Verified BOOLEAN DEFAULT FALSE,
    First_Name VARCHAR(100) NOT NULL,
    Last_Name VARCHAR(100) NOT NULL,
    Service_Permissions ENUM('user', 'admin') DEFAULT 'user',
    Password VARCHAR(255) NOT NULL,
    Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE PasswordResetCodes (
    Pk_Account_Email VARCHAR(255) PRIMARY KEY,
    Code VARCHAR(10) NOT NULL,
    Issued_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Expires_At TIMESTAMP NOT NULL,
    FOREIGN KEY (Pk_Account_Email) REFERENCES Account(Account_Email) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE AccountEmailVerification (
    Pk_Account_Email VARCHAR(255) PRIMARY KEY,
    Code VARCHAR(10) NOT NULL,
    Issued_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Expires_At TIMESTAMP NOT NULL,
    FOREIGN KEY (Pk_Account_Email) REFERENCES Account(Account_Email) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE Campus (
    Pk_Campus_ID INT AUTO_INCREMENT PRIMARY KEY,
    Campus_Name VARCHAR(255) NOT NULL,
    Campus_Short_Name VARCHAR(255) NOT NULL UNIQUE,
    Campus_Description VARCHAR(1000) NOT NULL,
    Icon_URL VARCHAR(500) NOT NULL,
    Video_URL VARCHAR(500),
    Domain VARCHAR(255) NOT NULL,
    Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE CampusUser (
    Fk_User_Email VARCHAR(255),
    Fk_Campus_ID INT NOT NULL,
    Verified BOOLEAN DEFAULT FALSE,
    Campus_Permissions ENUM('user', 'moderator', 'admin') DEFAULT 'user',
    Joined_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (Fk_User_Email, Fk_Campus_ID),
    FOREIGN KEY (Fk_Campus_ID) REFERENCES Campus(Pk_Campus_ID) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (Fk_User_Email) REFERENCES Account(Account_Email) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE ParkingLot (
    Pk_Lot_ID INT AUTO_INCREMENT PRIMARY KEY,
    Pk_Campus_ID INT NOT NULL,
    Lot_Name VARCHAR(255) NOT NULL,
    Address VARCHAR(500),
    ImageFileName VARCHAR(500),
    Latitude DECIMAL(10, 8) NOT NULL,
    Longitude DECIMAL(11, 8) NOT NULL,
    Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Updated_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (Pk_Campus_ID) REFERENCES Campus(Pk_Campus_ID) ON DELETE CASCADE ON UPDATE CASCADE
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
    FOREIGN KEY (Pk_Lot_ID) REFERENCES ParkingLot(Pk_Lot_ID) ON DELETE CASCADE ON UPDATE CASCADE,
    UNIQUE KEY unique_floor_per_lot (Pk_Lot_ID, Floor_Number)
);

CREATE TABLE ParkingFloorFeatures (
    Fk_Floor_ID INT NOT NULL,
    Feature_Name VARCHAR(100) NOT NULL,
    UNIQUE (Fk_Floor_ID, Feature_Name),
    FOREIGN KEY (Fk_Floor_ID) REFERENCES ParkingFloor(Floor_ID) ON DELETE CASCADE ON UPDATE CASCADE
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

-- CREATE VIEW ParkingLotSummary AS
-- SELECT 
--     pl.Pk_Lot_ID,
--     pl.Lot_Name,
--     pl.Address,
--     pl.Latitude,
--     pl.Longitude,
--     pl.Total_Spots,
--     pl.Available_Spots,
--     pl.Has_Multiple_Floors,
--     c.Campus_Name,
--     GROUP_CONCAT(DISTINCT plf.Feature_Name SEPARATOR ', ') AS Features
-- FROM ParkingLot pl
-- JOIN Campus c ON pl.Pk_Campus_ID = c.Pk_Campus_ID
-- LEFT JOIN ParkingLotFeatures plf ON pl.Pk_Lot_ID = plf.Pk_Lot_ID
-- GROUP BY pl.Pk_Lot_ID;