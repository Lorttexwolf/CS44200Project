-- Regular: CRUD for Parking Lots
-- Create, available at DELETE /api/parking-lots/[ID]
-- This SQL operation for parking lots is handled by inserting a new record into the ParkingLot table. This SQL statement stores the campus ID the lot belongs to, along with its name, address, image filename, and geographic coordinates. This functionality is exposed through the POST /api/parking-lots endpoint and allows authorized users to register new parking lots within a campus.

INSERT INTO ParkingLot (Pk_Campus_ID, Lot_Name, Address, ImageFileName, Latitude, Longitude)
VALUES (?, ?, ?, ?, ?, ?);


-- Read, available at GET /api/parking-lots/[ID]
-- A combination of the above Complex: SQL List Floors of a ? Parking Lot, and Lot Listing.

-- The read operation is available at GET /api/parking-lots/[ID] and retrieves detailed information for a specific parking lot. This endpoint combines previously described SQL queries SQL List Floors of a ? Parking Lot, and Lot Listing, combining the parking lot listing and the retrieval of all floors associated with the selected lot. Together, these queries provide a complete view of the parking lot, including its metadata and per-floor availability information.

-- Update

UPDATE ParkingLot SET ${updates.join(', ')} WHERE Pk_Lot_ID = ?

-- Updating a parking lot is implemented using dynamic column updates with MySQL2 in a Node.js environment. An update object is constructed containing only the fields that need to be changed. These fields are converted into a dynamic SQL update statement and executed through the appropriate API route, allowing flexible updates via standard HTTP methods such as PUT.

-- Remove 

DELETE FROM ParkingLot WHERE Pk_Lot_ID = ?

-- Finally, the delete operation removes a parking lot from the system using its unique identifier. This is exposed through the DELETE /api/parking-lots/[ID] endpoint and executes a simple delete statement on the ParkingLot table. These CRUD operations are primarily used within the service administrator and campus management dashboards, while read operations support general campus-level viewing.