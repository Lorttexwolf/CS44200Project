-- Regular: CRUD for Parking Lot Floors

-- CREATE

INSERT INTO ParkingFloor (Pk_Lot_ID, Floor_Number, Floor_Name, Total_Spots, Available_Spots) VALUES (?, ?, ?, ?, ?)
This SQL statement inserts a new floor into an existing parking lot. This operation is exposed through the PUT /api/parking-lots/[ID]/floors endpoint, allowing authorized users to add new floors to a specific parking lot.

-- READ
-- A combination of the above Complex: SQL List Floors of a ?
-- For read operations, the system uses a combination of the previously described SQL List Floors of a ? Parking Lot query to retrieve all floors associated with a given parking lot. These queries aggregate relevant floor data and are used to display detailed per-floor information, such as availability and features for a selected lot.

-- UPDATE
-- Updating a parking floor is handled through a dynamic update approach using MySQL2 in a Node.js environment. An update object is constructed containing only the fields that need to be modified, such as floorName, totalSpots, availableSpots, or floorNumber. These fields are then translated into dynamic column assignments in the SQL statement, allowing a specific floor to be updated via PUT /api/parking-floors/[ID]. This operation is restricted to users authenticated with service-level or campus-level permissions for security purposes.

UPDATE ParkingFloor SET ${updates.join(', ')} WHERE Floor_ID = ?

-- DELETE
-- Deleting a parking floor is performed with a straightforward SQL delete statement that removes the floor by its unique identifier. This action is available through the DELETE /api/parking-floors/[ID] endpoint and is similarly limited to authenticated users with service or campus permissions. These CRUD operations are primarily utilized within the service admin and campus management dashboards, while read-only data is made available for general campus viewing.

DELETE FROM ParkingFloor WHERE Floor_ID = ?