// backend/routes/productos.js (Ahora usa sintaxis de Módulos ES)

import express from 'express';
import pool from '../db.js'; // Importa el pool de conexiones a la base de datos

const router = express.Router();

// Ruta para obtener todos los productos
router.get('/', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM productos'); // Ejecuta la consulta
        res.json(rows); // Envía los productos como respuesta JSON
    } catch (error) {
        console.error('Error al obtener productos:', error); // Log del error
        res.status(500).json({ error: 'Error del servidor al obtener productos.' }); // Envía error JSON
    }
});

// Ruta para obtener un producto por ID
router.get('/:id', async (req, res) => {
    const { id } = req.params; // Obtiene el ID del parámetro de la URL
    try {
        const [rows] = await pool.query('SELECT * FROM productos WHERE id = ?', [id]); // Ejecuta la consulta
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Producto no encontrado.' }); // Si no se encuentra, envía error 404
        }
        res.json(rows[0]); // Envía el producto encontrado como respuesta JSON
    } catch (error) {
        console.error('Error al obtener producto por ID:', error); // Log del error
        res.status(500).json({ error: 'Error del servidor al obtener el producto.' }); // Envía error JSON
    }
});

// Ruta para agregar un nuevo producto
router.post('/', async (req, res) => {
    const { nombre, descripcion, precio, stock, categoria } = req.body; // Obtiene los datos del cuerpo de la solicitud

    // Validación básica de los datos de entrada
    if (!nombre || !precio || !stock) {
        return res.status(400).json({ error: 'Nombre, precio y stock son requeridos.' });
    }
    if (isNaN(precio) || precio < 0) {
        return res.status(400).json({ error: 'Precio debe ser un número positivo.' });
    }
    if (isNaN(stock) || stock < 0) {
        return res.status(400).json({ error: 'Stock debe ser un número positivo o cero.' });
    }

    try {
        const [result] = await pool.query(
            'INSERT INTO productos (nombre, descripcion, precio, stock, categoria) VALUES (?, ?, ?, ?, ?)',
            [nombre, descripcion, precio, stock, categoria]
        );
        res.status(201).json({ 
            message: 'Producto agregado exitosamente.', 
            productId: result.insertId 
        }); // Envía respuesta de éxito con el ID del nuevo producto
    } catch (error) {
        console.error('Error al agregar producto:', error); // Log del error
        res.status(500).json({ error: 'Error del servidor al agregar producto.' }); // Envía error JSON
    }
});

// Ruta para actualizar un producto existente
router.put('/:id', async (req, res) => {
    const { id } = req.params; // Obtiene el ID del parámetro de la URL
    const { nombre, descripcion, precio, stock, categoria } = req.body; // Obtiene los datos del cuerpo de la solicitud

    // Validación básica de los datos de entrada (permitir actualizaciones parciales)
    if (precio !== undefined && (isNaN(precio) || precio < 0)) {
        return res.status(400).json({ error: 'Precio debe ser un número positivo.' });
    }
    if (stock !== undefined && (isNaN(stock) || stock < 0)) {
        return res.status(400).json({ error: 'Stock debe ser un número positivo o cero.' });
    }

    try {
        const [result] = await pool.query(
            'UPDATE productos SET nombre = ?, descripcion = ?, precio = ?, stock = ?, categoria = ? WHERE id = ?',
            [nombre, descripcion, precio, stock, categoria, id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Producto no encontrado o no se pudo actualizar.' }); // Si no se encuentra, envía error 404
        }
        res.json({ message: 'Producto actualizado exitosamente.' }); // Envía respuesta de éxito
    } catch (error) {
        console.error('Error al actualizar producto:', error); // Log del error
        res.status(500).json({ error: 'Error del servidor al actualizar producto.' }); // Envía error JSON
    }
});

// Ruta para eliminar un producto
router.delete('/:id', async (req, res) => {
    const { id } = req.params; // Obtiene el ID del parámetro de la URL
    try {
        const [result] = await pool.query('DELETE FROM productos WHERE id = ?', [id]); // Ejecuta la consulta
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Producto no encontrado o no se pudo eliminar.' }); // Si no se encuentra, envía error 404
        }
        res.json({ message: 'Producto eliminado exitosamente.' }); // Envía respuesta de éxito
    } catch (error) {
        console.error('Error al eliminar producto:', error); // Log del error
        res.status(500).json({ error: 'Error del servidor al eliminar producto.' }); // Envía error JSON
    }
});

export default router;
