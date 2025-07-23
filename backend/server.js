// backend/server.js (Ahora usa sintaxis de Módulos ES)

import express from 'express'; // Usar 'import'
import cors from 'cors';       // Usar 'import'
import 'dotenv/config';        // Forma moderna de cargar dotenv en ESM

// Importa tus routers usando 'import' y añadiendo '.js' a las rutas de archivos locales
import productosRoutes from './routes/productos.js';
import ventasRoutes from './routes/ventas.js';
import usuariosRoutes from './routes/usuarios.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors()); // Permite solicitudes desde tu frontend
app.use(express.json()); // Para parsear JSON en el cuerpo de las solicitudes

// Usa las rutas
app.use('/api/productos', productosRoutes);
app.use('/api/ventas', ventasRoutes);
app.use('/api/usuarios', usuariosRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
    res.send('API de Tienda de Ropa funcionando!');
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
    console.log(`Accede a la API en: http://localhost:${PORT}`);
});

// Opcional: Para cerrar la conexión del pool cuando la aplicación se cierra
// (El pool se importa implícitamente en las rutas, así que no lo cerramos directamente aquí)
// Si necesitas cerrar el pool explícitamente, tendrías que importarlo aquí también
// import pool from './db.js';
// process.on('SIGINT', async () => {
//     console.log('Cerrando pool de conexiones...');
//     await pool.end();
//     console.log('Pool de conexiones a la base de datos cerrado.');
//     process.exit(0);
// });
