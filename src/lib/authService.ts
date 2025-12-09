import bcrypt from 'bcryptjs';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import pool from './db';

export interface User {
  email: string;
  firstName: string;
  lastName: string;
  verified: boolean;
  servicePermissions: 'user' | 'admin' | 'campus_admin';
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface LoginData {
  email: string;
  password: string;
}

// Register a new user
export async function registerUser(data: RegisterData): Promise<{ success: boolean; message: string; userId?: string }> {
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();

    // Check if user already exists
    const [existingUsers] = await connection.query<RowDataPacket[]>(
      'SELECT Account_Email FROM Account WHERE Account_Email = ?',
      [data.email]
    );

    if (existingUsers.length > 0) {
      return { success: false, message: 'Email already registered' };
    }

    // We aren't doing hashed passwords for ease of presentation.
    // Hash password
    // const saltRounds = 10;
    // const passwordHash = await bcrypt.hash(data.password, saltRounds);

    // Insert new user
    await connection.query<ResultSetHeader>(
      `INSERT INTO Account (Account_Email, Password, First_Name, Last_Name, Verified, Service_Permissions)
       VALUES (?, ?, ?, ?, TRUE, 'user')`,
      [data.email, data.password, data.firstName, data.lastName]
    );

    await connection.commit();

    return {
      success: true,
      message: 'User registered successfully. You can now log in.',
      userId: data.email
    };
  } catch (error) {
    await connection.rollback();
    console.error('Registration error:', error);
    return { success: false, message: 'Registration failed. Please try again.' };
  } finally {
    connection.release();
  }
}

// Login user
export async function loginUser(data: LoginData): Promise<{ success: boolean; message: string; user?: User }> {
  try {
    // Get user from database
    const [users] = await pool.query<RowDataPacket[]>(
      `SELECT Account_Email, Password, First_Name, Last_Name, Verified, Service_Permissions
       FROM Account
       WHERE Account_Email = ?`,
      [data.email]
    );

    if (users.length === 0) {
      return { success: false, message: 'Invalid email or password' };
    }

    const user = users[0];

    // We aren't doing hashed passwords for ease of presentation.
    // Verify password
    const isPasswordValid = data.password === user.Password;
    // const isPasswordValid = await bcrypt.compare(data.password, user.Password_Hash);

    if (!isPasswordValid) {
      return { success: false, message: 'Invalid email or password' };
    }

    const userData: User = {
      email: user.Account_Email,
      firstName: user.First_Name,
      lastName: user.Last_Name,
      verified: Boolean(user.Verified),
      servicePermissions: user.Service_Permissions
    };

    return {
      success: true,
      message: 'Login successful',
      user: userData
    };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, message: 'Login failed. Please try again.' };
  }
}

// Verify email with code
export async function verifyEmail(email: string, code: string): Promise<{ success: boolean; message: string }> {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    // Check verification code
    const [verifications] = await connection.query<RowDataPacket[]>(
      `SELECT Code, Expires_At FROM AccountEmailVerification
       WHERE Pk_Account_Email = ? AND Code = ?`,
      [email, code]
    );

    if (verifications.length === 0) {
      return { success: false, message: 'Invalid verification code' };
    }

    const verification = verifications[0];

    // Check if code is expired
    if (new Date(verification.Expires_At) < new Date()) {
      return { success: false, message: 'Verification code has expired' };
    }

    // Update user as verified
    await connection.query<ResultSetHeader>(
      'UPDATE Account SET Verified = TRUE WHERE Account_Email = ?',
      [email]
    );

    // Delete verification code
    await connection.query<ResultSetHeader>(
      'DELETE FROM AccountEmailVerification WHERE Pk_Account_Email = ?',
      [email]
    );

    await connection.commit();

    return { success: true, message: 'Email verified successfully' };
  } catch (error) {
    await connection.rollback();
    console.error('Verification error:', error);
    return { success: false, message: 'Verification failed. Please try again.' };
  } finally {
    connection.release();
  }
}

// Request password reset
export async function requestPasswordReset(email: string): Promise<{ success: boolean; message: string }> {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    // Check if user exists
    const [users] = await connection.query<RowDataPacket[]>(
      'SELECT Account_Email FROM Account WHERE Account_Email = ?',
      [email]
    );

    if (users.length === 0) {
      // Don't reveal if email exists or not for security
      return { success: true, message: 'If the email exists, a reset code has been sent' };
    }

    // Generate reset code
    const resetCode = Math.random().toString(36).substring(2, 12).toUpperCase();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1); // 1 hour expiry

    // Delete any existing reset codes
    await connection.query<ResultSetHeader>(
      'DELETE FROM PasswordResetCodes WHERE Pk_Account_Email = ?',
      [email]
    );

    // Insert new reset code
    await connection.query<ResultSetHeader>(
      `INSERT INTO PasswordResetCodes (Pk_Account_Email, Code, Expires_At, Used)
       VALUES (?, ?, ?, FALSE)`,
      [email, resetCode, expiresAt]
    );

    await connection.commit();

    // In production, send email here
    console.log(`Password reset code for ${email}: ${resetCode}`);

    return { success: true, message: 'If the email exists, a reset code has been sent' };
  } catch (error) {
    await connection.rollback();
    console.error('Password reset request error:', error);
    return { success: false, message: 'Failed to process request. Please try again.' };
  } finally {
    connection.release();
  }
}

// Reset password with code
export async function resetPassword(
  email: string,
  code: string,
  newPassword: string
): Promise<{ success: boolean; message: string }> {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    // Check reset code
    const [resetCodes] = await connection.query<RowDataPacket[]>(
      `SELECT Code, Expires_At, Used FROM PasswordResetCodes
       WHERE Pk_Account_Email = ? AND Code = ?`,
      [email, code]
    );

    if (resetCodes.length === 0) {
      return { success: false, message: 'Invalid reset code' };
    }

    const resetCode = resetCodes[0];

    if (resetCode.Used) {
      return { success: false, message: 'Reset code has already been used' };
    }

    if (new Date(resetCode.Expires_At) < new Date()) {
      return { success: false, message: 'Reset code has expired' };
    }

    // Hash new password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(newPassword, saltRounds);

    // Update password
    await connection.query<ResultSetHeader>(
      'UPDATE Account SET Password_Hash = ? WHERE Account_Email = ?',
      [passwordHash, email]
    );

    // Mark code as used
    await connection.query<ResultSetHeader>(
      'UPDATE PasswordResetCodes SET Used = TRUE WHERE Pk_Account_Email = ? AND Code = ?',
      [email, code]
    );

    await connection.commit();

    return { success: true, message: 'Password reset successfully' };
  } catch (error) {
    await connection.rollback();
    console.error('Password reset error:', error);
    return { success: false, message: 'Failed to reset password. Please try again.' };
  } finally {
    connection.release();
  }
}

// Get user by email
export async function getUserByEmail(email: string): Promise<User | null> {
  try {
    const [users] = await pool.query<RowDataPacket[]>(
      `SELECT Account_Email, First_Name, Last_Name, Verified, Service_Permissions
       FROM Account
       WHERE Account_Email = ?`,
      [email]
    );

    if (users.length === 0) {
      return null;
    }

    const user = users[0];

    return {
      email: user.Account_Email,
      firstName: user.First_Name,
      lastName: user.Last_Name,
      verified: Boolean(user.Verified),
      servicePermissions: user.Service_Permissions
    };
  } catch (error) {
    console.error('Get user error:', error);
    return null;
  }
}
