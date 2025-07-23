// backend/index.js (Ahora usa sintaxis de Módulos ES)

import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv'; // Para cargar variables de entorno
import productosRoutes from './routes/productos.js'; // Importa las rutas de productos
import ventasRoutes from './routes/ventas.js';     // Importa las rutas de ventas
import usuariosRoutes from './routes/usuarios.js';   // Importa las rutas de usuarios

dotenv.config(); // Carga las variables de entorno desde .env

const app = express();
const port = process.env.PORT || 3001; // Usa el puerto de las variables de entorno o 3001 por defecto

// Middlewares
app.use(cors()); // Habilita CORS para permitir peticiones desde el frontend
app.use(bodyParser.json()); // Para parsear cuerpos de solicitud JSON

// Rutas de la API
app.use('/api/productos', productosRoutes); // Usa las rutas de productos bajo /api/productos
app.use('/api/ventas', ventasRoutes);       // Usa las rutas de ventas bajo /api/ventas
app.use('/api/usuarios', usuariosRoutes);   // Usa las rutas de usuarios bajo /api/usuarios

// Ruta de prueba para verificar que el servidor está funcionando
app.get('/', (req, res) => {
    res.send('Servidor de la API de Tienda de Ropa funcionando!');
});

// Manejador de errores global (opcional pero recomendado)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Algo salió mal en el servidor!');
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en el puerto ${port}`);
    console.log(`Accede a la API en: http://localhost:${port}`);
});
