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
    l.Pk_Campus_ID = @PNW_CAMPUS_ID
GROUP BY
    l.Pk_Lot_ID,
    l.Lot_Name,
    l.ImageFileName,
    l.Address,
    l.Latitude,
    l.Longitude,
    l.Created_At;