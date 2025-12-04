import mysql from 'mysql2/promise';

// Create a connection pool for better performance
const pool = mysql.createPool({
  
  host: process.env.DB_HOST ?? 'localhost',
  user: process.env.DB_USER ?? 'root',
  password: process.env.DB_PASSWORD ?? '',
  database: process.env.DB_NAME ?? 'pnwparking',
  port: process.env.DB_PORT ? Number.parseInt(process.env.DB_PORT) : 3306,
  waitForConnections: true,
  connectionLimit: 100,
  idleTimeout: 2000, // 2 Seconds
  queueLimit: 0,
});

export default pool;
