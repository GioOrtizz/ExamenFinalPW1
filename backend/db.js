// backend/db.js (Ahora usa sintaxis de Módulos ES)

import mysql from 'mysql2'; // Usar 'import' en lugar de 'require'
import 'dotenv/config';    // Forma moderna de cargar dotenv en ESM

// Crea el pool de conexiones a la base de datos
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
}).promise(); // Usamos .promise() para poder usar async/await con las consultas

// Exporta el pool de conexiones usando 'export default'
export default pool;
