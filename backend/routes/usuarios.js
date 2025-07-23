// backend/routes/usuarios.js (Ahora usa sintaxis de Módulos ES)

import express from 'express';
import bcrypt from 'bcrypt';
import pool from '../db.js'; // Importa el pool de conexiones

const router = express.Router();

// Ruta para registrar un nuevo usuario (ELIMINADA o IGNORADA si solo quieres admin)
// Si esta ruta no es necesaria, puedes comentarla o eliminarla.
// router.post('/register', async (req, res) => {
//     const { usuario, contraseña } = req.body;
//     if (!usuario || !contraseña) {
//         return res.status(400).json({ error: 'Usuario y contraseña son requeridos.' });
//     }
//     try {
//         const [existingUsers] = await pool.query('SELECT * FROM usuarios WHERE usuario = ?', [usuario]);
//         if (existingUsers.length > 0) {
//             return res.status(409).json({ error: 'El nombre de usuario ya existe.' });
//         }
//         const hashedPassword = await bcrypt.hash(contraseña, 10);
//         const [result] = await pool.query('INSERT INTO usuarios (usuario, contraseña_hash) VALUES (?, ?)', [usuario, hashedPassword]);
//         res.status(201).json({ message: 'Usuario registrado exitosamente.', userId: result.insertId });
//     } catch (error) {
//         console.error('Error al registrar usuario:', error);
//         res.status(500).json({ error: 'Error del servidor al registrar usuario.' });
//     }
// });

// Ruta para iniciar sesión (ahora maneja el usuario 'admin' hardcodeado)
router.post('/login', async (req, res) => {
    const { usuario, contraseña } = req.body;

    if (!usuario || !contraseña) {
        return res.status(400).json({ error: 'Usuario y contraseña son requeridos.' });
    }

    // Lógica para el usuario 'admin' hardcodeado
    if (usuario === 'admin' && contraseña === '12345') {
        return res.status(200).json({ message: 'Login exitoso como admin.', usuario: 'admin' });
    }

    // Si no es el usuario 'admin' hardcodeado, procede con la autenticación de la base de datos
    try {
        const [rows] = await pool.query('SELECT * FROM usuarios WHERE usuario = ?', [usuario]);

        if (rows.length === 0) {
            return res.status(401).json({ error: 'Usuario o contraseña incorrectos.' });
        }

        const user = rows[0];
        const hashedPassword = user.contraseña_hash;

        if (!hashedPassword) {
            console.error(`Usuario ${usuario} encontrado, pero sin contraseña hash.`);
            return res.status(500).json({ error: 'Error interno: Contraseña no configurada para este usuario.' });
        }

        const match = await bcrypt.compare(contraseña, hashedPassword);

        if (match) {
            res.status(200).json({ message: 'Login exitoso.', usuario: user.usuario });
        } else {
            res.status(401).json({ error: 'Usuario o contraseña incorrectos.' });
        }
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        res.status(500).json({ error: 'Error del servidor al procesar el login.' });
    }
});

// Exporta el router usando 'export default'
export default router;
