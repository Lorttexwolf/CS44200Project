INSERT INTO Campus (Campus_Name, Campus_Short_Name, Campus_Description, Domain, Icon_URL, Video_URL)
VALUES (
    'Purdue University Northwest', 
    'PNW', 
    'Rooted in Northwest Indiana, Purdue University Northwest (PNW) is a student-centered university transforming lives with innovative education.', 
    'pnw.edu', 
    'https://www.pnw.edu/marketing-communications/wp-content/uploads/sites/9/2020/03/PNW_-V_WG-01_264x116.jpg', 
    'https://www.pnw.edu/wp-content/uploads/2025/01/PNW_Website-Header-B_ELQ3.mp4');

SET @PNW_CAMPUS_ID = LAST_INSERT_ID();

-- Give Aaron Jung admin permissions over the PNW Campus. He can add, edit, and remove parking lots.

INSERT INTO CampusUser (Fk_User_Email, Fk_Campus_ID, Verified, Campus_Permissions) 
VALUES ('jung416@pnw.edu', @PNW_CAMPUS_ID, TRUE,  'admin');