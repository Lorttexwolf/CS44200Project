--  Complex: Account Creation & Verification 
-- This SQL statement is used to create a new account with default user-level permissions and marks the email address as verified at the time of registration. This creates the structure for future implementation of an email verification service. The Account table stores login credentials and basic profile information, including their email, password, first name, and last name. To get around not having a readily available verification service, Verified is set to TRUE, and by assigning ‘user’ to Service_Permissions, the account is immediately granted standard access without requiring any additional verification.

INSERT INTO Account (Account_Email, Password, First_Name, Last_Name, Verified, Service_Permissions)
VALUES (?, ?, ?, ?, TRUE, 'user');

-- If an email server were implemented, newly registered users would not be marked as verified by default. Instead, those users would be redirected to an Enter Code screen, where they would be required to input a verification code sent to their email address. In this scenario, a record would be inserted into the AccountEmailVerification table, storing the associated account email, a generated verification code, the code issued timestamp, and its expiration timestamp for security purposes.

INSERT INTO AccountEmailVerification (Pk_Account_Email, Code, Issued_At, Expires_At)
VALUES (?, 1234567890, NOW(), NOW() + INTERVAL 30 MINUTE);

-- Once the user enters the correct verification code and it is confirmed to be unexpired, the system would update the corresponding account in the Account table to mark it as verified. After successful verification or the time has gone past the expiration time, the related entry in the AccountEmailVerification table would be deleted to prevent reuse, and to keep the table clean. The default state of the table should be empty, as no requests to verify an email have been made.

