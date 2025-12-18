-- Complex: SQL List Floors of a ? Parking Lot
-- This query retrieves all floors belonging to a specific parking lot of a campus. It begins by joining the ParkingFloor with the ParkingFloorFeatures table to better describe each floor with details such as the floor number, total parking spots, and feature names. The LEFT JOIN not only allows us to avoid nulls that would come from floors not having some, while also not removing entries that don’t have features.
-- The GROUP_CONCAT aggregate function is used to combine multiple feature records associated with the same floor into a single, comma-separated string. This was used to reduce all the rows of ff.Feature_Name into a single string, reducing visual clutter. We also use GROUP BY and ORDER BY to better organize and allow easier front-end use.

SELECT
    f.Floor_Number,
    f.Floor_Name,
    f.Available_Spots,
    f.Total_Spots,
    f.Floor_ID,
    f.Created_At,
    GROUP_CONCAT(ff.Feature_Name) AS Features
FROM ParkingFloor f
LEFT JOIN ParkingFloorFeatures ff
    ON ff.Fk_Floor_ID = f.Floor_ID
WHERE f.Pk_Lot_ID = ?
GROUP BY
    f.Floor_ID,
    f.Floor_Number,
    f.Floor_Name,
    f.Available_Spots,
    f.Total_Spots,
    f.Created_At
ORDER BY f.Floor_Number;
