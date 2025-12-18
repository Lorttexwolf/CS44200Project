-- Complex: SQL List Parking Lots at PNW
-- This query retrieves all parking lots associated with a selected campus. It begins by joining the ParkingLot table with the ParkingFloor table in order to aggregate all possible parking data across all floors within each lot. The left join is used to avoid null values appearing due to some lots not having separate floors. Using the SQL aggregate functions, this query calculates the total number of parking spots and the total number of currently available spots for each lot.
-- In addition to availability data, each record includes the lot’s name, address, image filename, and geographic coordinates (latitude and longitude). The inclusion of geographical coordinates enables map-based visualization on the front-end, allowing users to better see where each parking lot is located on campus.
-- The results of this query are displayed when you select a campus on the /campus/[ID] page, where general users can view real-time parking availability across their selected campus. This same data also supports the service and campus administrator dashboards, where CRUD operations can be performed to manage parking lots and their associated information.

SELECT
    l.Pk_Campus_ID,
    l.Pk_Lot_ID,
    l.Lot_Name,
    l.ImageFileName,
    l.Address,
    SUM(f.Total_Spots) AS Total_Spots,
    SUM(f.Available_Spots) AS Available_Spots,
    l.Latitude,
    l.Longitude,
    l.Created_At
FROM
    ParkingLot l
JOIN ParkingFloor f ON f.Pk_Lot_ID = l.Pk_Lot_ID
WHERE
    l.Pk_Campus_ID = ?
GROUP BY
    l.Pk_Lot_ID,
    l.Lot_Name,
    l.ImageFileName,
    l.Address,
    l.Latitude,
    l.Longitude,
    l.Created_At;
