/**
 * Shared API Utilities for All Route Handlers
 * Centralized validators, helpers, and error handling
 * Adapted for MySQL with connection pooling
 */

import pool from './db';
import { RowDataPacket } from 'mysql2';

// ============================================================================
// VALIDATORS & REGEXES
// ============================================================================

export const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

// Require: 1 uppercase, 1 lowercase, 1 digit, 1 special char, 8-72 length
export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()_+\-=\[\]{};':"\\|,.<>\/?])[A-Za-z\d@$!%*?&#^()_+\-=\[\]{};':"\\|,.<>\/?]{8,72}$/;

export const PHONE_REGEX = /^[+]?[\d\s().-]{7,20}$/;

export const ALPHANUMERIC_REGEX = /^[a-zA-Z0-9_-]+$/;

// Constants
export const SUPPORTED_LOCALES = ['en', 'es', 'zh'];

export const VALID_ROLES = ['user', 'admin', 'campus_admin'];

export const VALID_PARKING_PERMISSIONS = ['user', 'moderator', 'admin'];

export const VALID_CAMPUS_PERMISSIONS = ['basic', 'premium', 'enterprise'];

export const VALID_SPOT_TYPES = ['standard', 'accessible', 'ev_charging', 'compact', 'motorcycle'];

export const VALID_RESERVATION_STATUSES = ['active', 'completed', 'cancelled'];

// Size limits (in characters unless noted)
export const MAX_TITLE_LENGTH = 200;
export const MAX_DESCRIPTION_LENGTH = 5000;
export const MAX_NAME_LENGTH = 100;
export const MAX_BIO_LENGTH = 5000;
export const MAX_MESSAGE_LENGTH = 5000;
export const MAX_EMAIL_LENGTH = 254;
export const MAX_PHONE_LENGTH = 20;
export const MAX_TEXT_LENGTH = 5000;
export const MAX_PAYLOAD_SIZE = 50000; // 50KB in characters

// Pagination defaults
export const DEFAULT_LIMIT = 50;
export const MAX_LIMIT = 500;
export const MIN_LIMIT = 1;

// ============================================================================
// VALIDATION FUNCTIONS
// ============================================================================

export function isValidUUID(value: string | unknown): boolean {
  if (typeof value !== 'string') return false;
  return UUID_REGEX.test(value);
}

export function isValidEmail(value: string | unknown): boolean {
  if (typeof value !== 'string') return false;
  if (value.length > MAX_EMAIL_LENGTH) return false;
  return EMAIL_REGEX.test(value.toLowerCase());
}

export function isValidPassword(value: string | unknown): boolean {
  if (typeof value !== 'string') return false;
  if (value.length < 8 || value.length > 72) return false;
  // Check for common weak passwords
  const commonPasswords = ['password', '12345678', 'qwerty', 'abc123', 'password123'];
  if (commonPasswords.includes(value.toLowerCase())) return false;
  return PASSWORD_REGEX.test(value);
}

export function isValidPhone(value: string | unknown): boolean {
  if (typeof value !== 'string') return false;
  if (value.length > MAX_PHONE_LENGTH) return false;
  return PHONE_REGEX.test(value);
}

export function isValidLocale(value: string | unknown): boolean {
  if (typeof value !== 'string') return false;
  return SUPPORTED_LOCALES.includes(value);
}

export function isValidRole(value: string | unknown): boolean {
  if (typeof value !== 'string') return false;
  return VALID_ROLES.includes(value);
}

export function isValidParkingPermission(value: string | unknown): boolean {
  if (typeof value !== 'string') return false;
  return VALID_PARKING_PERMISSIONS.includes(value);
}

export function isValidCampusPermission(value: string | unknown): boolean {
  if (typeof value !== 'string') return false;
  return VALID_CAMPUS_PERMISSIONS.includes(value);
}

export function isValidSpotType(value: string | unknown): boolean {
  if (typeof value !== 'string') return false;
  return VALID_SPOT_TYPES.includes(value);
}

export function isValidReservationStatus(value: string | unknown): boolean {
  if (typeof value !== 'string') return false;
  return VALID_RESERVATION_STATUSES.includes(value);
}

export function isValidTextLength(value: string | unknown, maxLength: number): boolean {
  if (typeof value !== 'string') return false;
  return value.length <= maxLength;
}

export function isValidAlphanumeric(value: string | unknown): boolean {
  if (typeof value !== 'string') return false;
  return ALPHANUMERIC_REGEX.test(value);
}

export function isValidFutureDate(value: string | Date | unknown): boolean {
  if (!value) return false;
  const date = typeof value === 'string' ? new Date(value) : value as Date;
  if (!(date instanceof Date) || isNaN(date.getTime())) return false;
  return date > new Date();
}

export function isValidInteger(value: any): boolean {
  return Number.isInteger(value) && value >= 0;
}

export function isValidSlots(value: any): boolean {
  return Number.isInteger(value) && value >= 1 && value <= 1000;
}

export function isValidPaginationLimit(value: any): boolean {
  const num = Number(value);
  return !isNaN(num) && num >= MIN_LIMIT && num <= MAX_LIMIT;
}

export function isValidPaginationOffset(value: any): boolean {
  const num = Number(value);
  return !isNaN(num) && num >= 0;
}

export function isValidPayloadSize(payload: any): boolean {
  const size = JSON.stringify(payload).length;
  return size <= MAX_PAYLOAD_SIZE;
}

// ============================================================================
// SANITIZATION & FORMATTING
// ============================================================================

export function sanitizeEmail(email: string): string {
  return email.toLowerCase().trim();
}

export function sanitizeText(text: string): string {
  return text.trim();
}

export function sanitizeName(name: string): string {
  return name.trim();
}

// XSS Protection - Sanitize HTML/script tags from user input
export function sanitizeHtml(text: string): string {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

// Sanitize text input to prevent XSS while preserving safe formatting
export function sanitizeTextInput(text: string): string {
  if (!text) return '';
  // Remove any script tags, event handlers, and potentially dangerous content
  return text
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
    .replace(/on\w+\s*=\s*[^\s>]*/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/data:text\/html/gi, '')
    .trim();
}

export function sanitizeError(error: any): string {
  if (!error) return 'An unexpected error occurred';

  // Check if it's an Error object
  const message = error instanceof Error ? error.message : String(error);

  // Database errors - sanitize
  if (message.includes('duplicate key')) {
    return 'This record already exists';
  }

  if (message.includes('foreign key')) {
    return 'Referenced record does not exist';
  }

  if (message.includes('not null')) {
    return 'Missing required field';
  }

  // Custom errors - pass through
  if (message === 'UNAUTHORIZED' || message === 'FORBIDDEN') {
    return message;
  }

  // Auth errors
  if (message.includes('Invalid login')) {
    return 'Invalid credentials';
  }

  if (message.includes('User already registered')) {
    return 'This email is already registered';
  }

  // Default generic error
  return 'An error occurred. Please try again.';
}

// ============================================================================
// PAGINATION HELPERS
// ============================================================================

export interface PaginationParams {
  limit: number;
  offset: number;
}

export function parsePaginationParams(limit?: any, offset?: any): PaginationParams {
  let parsedLimit = DEFAULT_LIMIT;
  let parsedOffset = 0;

  if (limit !== undefined) {
    const num = Number(limit);
    if (!isNaN(num) && num >= MIN_LIMIT && num <= MAX_LIMIT) {
      parsedLimit = num;
    }
  }

  if (offset !== undefined) {
    const num = Number(offset);
    if (!isNaN(num) && num >= 0) {
      parsedOffset = num;
    }
  }

  return { limit: parsedLimit, offset: parsedOffset };
}

// ============================================================================
// AUTHENTICATION HELPERS - MySQL/Cookie-based
// ============================================================================

export async function getUserFromCookie(request: Request): Promise<any | null> {
  const cookies = request.headers.get('cookie');
  if (!cookies) return null;

  const userCookie = cookies.split(';').find(c => c.trim().startsWith('user='));
  if (!userCookie) return null;

  try {
    const userJson = userCookie.split('=')[1];
    return JSON.parse(decodeURIComponent(userJson));
  } catch {
    return null;
  }
}

export async function checkAuth(request: Request) {
  const user = await getUserFromCookie(request);
  
  if (!user) {
    const err = new Error('UNAUTHORIZED');
    throw err;
  }

  return user;
}

export async function checkAuthorization(
  email: string,
  allowedRoles: string[] = []
) {
  if (allowedRoles.length === 0) {
    return; // No specific roles required, just authenticated
  }

  // Validate role against whitelist
  for (const role of allowedRoles) {
    if (!isValidRole(role)) {
      throw new Error('Invalid role configuration');
    }
  }

  const [users] = await pool.query<RowDataPacket[]>(
    'SELECT Service_Permissions FROM Account WHERE Account_Email = ?',
    [email]
  );

  if (users.length === 0) {
    const err = new Error('FORBIDDEN');
    throw err;
  }

  const userRole = users[0].Service_Permissions;

  if (!allowedRoles.includes(userRole)) {
    const err = new Error('FORBIDDEN');
    throw err;
  }
}

export async function getUserRole(email: string): Promise<string | null> {
  const [users] = await pool.query<RowDataPacket[]>(
    'SELECT Service_Permissions FROM Account WHERE Account_Email = ?',
    [email]
  );

  if (users.length === 0) return null;
  return users[0].Service_Permissions;
}

export async function checkCampusOwnership(
  campusId: number,
  userEmail: string
) {
  const [campuses] = await pool.query<RowDataPacket[]>(
    'SELECT Pk_User_Email FROM Campus WHERE Pk_Campus_ID = ?',
    [campusId]
  );

  if (campuses.length === 0) {
    throw new Error('NOT_FOUND');
  }

  if (campuses[0].Pk_User_Email !== userEmail) {
    throw new Error('FORBIDDEN');
  }
}

// ============================================================================
// REQUEST PARSING HELPERS
// ============================================================================

export async function parseJsonBody(request: Request): Promise<any> {
  try {
    const text = await request.text();

    if (!isValidPayloadSize(text)) {
      throw new Error('Payload too large');
    }

    return JSON.parse(text);
  } catch (error) {
    throw new Error('Invalid JSON');
  }
}

export function getQueryParam(url: URL, key: string): string | null {
  return url.searchParams.get(key);
}

export function getQueryParamAsNumber(url: URL, key: string): number | null {
  const value = url.searchParams.get(key);
  if (!value) return null;
  const num = Number(value);
  return isNaN(num) ? null : num;
}

// ============================================================================
// RESPONSE HELPERS
// ============================================================================

export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

export function successResponse<T>(data: T, status: number = 200) {
  return new Response(JSON.stringify({ data }), {
    status,
    headers: { 'Content-Type': 'application/json' }
  });
}

export function errorResponse(message: string, status: number = 400) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { 'Content-Type': 'application/json' }
  });
}

// ============================================================================
// CSRF PROTECTION
// ============================================================================

export function validateOrigin(request: Request): boolean {
  const origin = request.headers.get('origin');
  const referer = request.headers.get('referer');
  const host = request.headers.get('host');
  
  if (!origin && !referer) {
    // Allow requests without origin/referer (same-origin requests from browsers)
    return true;
  }
  
  const allowedOrigins = [
    process.env.NEXT_PUBLIC_APP_URL,
    'http://localhost:3000',
    'http://localhost:3001',
    'https://localhost:3000'
  ].filter(Boolean);
  
  if (origin) {
    return allowedOrigins.some(allowed => origin === allowed || origin.startsWith(allowed + '/'));
  }
  
  if (referer) {
    return allowedOrigins.some(allowed => referer.startsWith(allowed + '/'));
  }
  
  return false;
}

export function checkCSRFProtection(request: Request): boolean {
  // For state-changing operations (POST, PUT, PATCH, DELETE)
  const method = request.method;
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
    return validateOrigin(request);
  }
  return true;
}

// Generate cryptographically secure random token
export function generateSecureToken(bytes: number = 32): string {
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    const buffer = new Uint8Array(bytes);
    crypto.getRandomValues(buffer);
    return Array.from(buffer, byte => byte.toString(16).padStart(2, '0')).join('');
  }
  // Fallback for Node.js environment
  const nodeCrypto = require('crypto');
  return nodeCrypto.randomBytes(bytes).toString('hex');
}

// ============================================================================
// VALIDATION CHAINS (Utilities for common validation patterns)
// ============================================================================

export function validateEmailField(email: any): string {
  if (!isValidEmail(email)) {
    throw new Error('Invalid email address');
  }
  return sanitizeEmail(email);
}

export function validateRoleField(role: any): string {
  if (!isValidRole(role)) {
    throw new Error('Invalid role');
  }
  return role;
}

export function validateLocaleField(locale: any): string {
  if (!isValidLocale(locale)) {
    throw new Error('Invalid locale');
  }
  return locale;
}

export function validateUuidField(id: any): string {
  if (!isValidUUID(id)) {
    throw new Error('Invalid ID format');
  }
  return id;
}

export function validateTextField(text: any, maxLength: number = MAX_TEXT_LENGTH): string {
  if (typeof text !== 'string') {
    throw new Error('Text must be a string');
  }
  if (!isValidTextLength(text, maxLength)) {
    throw new Error(`Text must not exceed ${maxLength} characters`);
  }
  return sanitizeText(text);
}

export function validateStatusField(status: any, validStatuses: string[]): string {
  if (!validStatuses.includes(status)) {
    throw new Error(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
  }
  return status;
}

export function validatePaginationParams(limit?: any, offset?: any): PaginationParams {
  if (limit !== undefined && !isValidPaginationLimit(limit)) {
    throw new Error(`Limit must be between ${MIN_LIMIT} and ${MAX_LIMIT}`);
  }
  if (offset !== undefined && !isValidPaginationOffset(offset)) {
    throw new Error('Offset must be non-negative');
  }
  return parsePaginationParams(limit, offset);
}

// ============================================================================
// TIMING-SAFE OPERATIONS
// ============================================================================

// Constant-time string comparison to prevent timing attacks
export function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false;
  }
  
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  
  return result === 0;
}
