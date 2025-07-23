// backend/routes/ventas.js (Ahora usa sintaxis de Módulos ES)
// Versión corregida para el error 'pool.rollback is not a function' - 23/07/2025

import express from 'express';
import pool from '../db.js'; // Importa el pool de conexiones a la base de datos

const router = express.Router();

// Ruta para obtener todas las ventas
router.get('/', async (req, res) => {
    try {
        // Consulta SQL para obtener todas las ventas, incluyendo el nombre y precio del producto
        const query = `
            SELECT 
                v.id AS venta_id,
                v.producto_id,
                p.nombre AS producto_nombre,
                p.precio AS producto_precio,
                v.cantidad,
                v.fecha_venta
            FROM 
                ventas v
            JOIN 
                productos p ON v.producto_id = p.id
            ORDER BY 
                v.fecha_venta DESC;
        `;
        const [rows] = await pool.query(query); // Ejecuta la consulta
        res.json(rows); // Envía las ventas como respuesta JSON
    } catch (error) {
        console.error('Error al obtener ventas:', error); // Log del error
        res.status(500).json({ error: 'Error del servidor al obtener ventas.' }); // Envía error JSON
    }
});

// Ruta para registrar una nueva venta
router.post('/', async (req, res) => {
    const { producto_id, cantidad } = req.body; // Obtiene los datos del cuerpo de la solicitud

    // Validación básica de los datos de entrada
    if (!producto_id || !cantidad || cantidad <= 0) {
        return res.status(400).json({ error: 'ID de producto y cantidad válidos son requeridos.' });
    }

    let connection; // Variable para la conexión a la base de datos (para transacciones)
    try {
        connection = await pool.getConnection(); // Obtiene una conexión del pool
        await connection.beginTransaction(); // Inicia una transacción

        // 1. Verificar el stock del producto
        const [productRows] = await connection.query('SELECT id, stock, precio FROM productos WHERE id = ? FOR UPDATE', [producto_id]); // Bloquea la fila para evitar condiciones de carrera

        if (productRows.length === 0) {
            await connection.rollback(); // Deshace la transacción si el producto no existe
            return res.status(404).json({ error: 'Producto no encontrado.' });
        }

        const product = productRows[0];
        if (product.stock < cantidad) {
            await connection.rollback(); // Deshace la transacción si no hay suficiente stock
            return res.status(400).json({ error: 'Stock insuficiente para esta venta.' });
        }

        // 2. Registrar la venta
        const [saleResult] = await connection.query(
            'INSERT INTO ventas (producto_id, cantidad) VALUES (?, ?)',
            [producto_id, cantidad]
        );

        // 3. Actualizar el stock del producto
        await connection.query(
            'UPDATE productos SET stock = stock - ? WHERE id = ?',
            [cantidad, producto_id]
        );

        await connection.commit(); // Confirma la transacción si todo fue exitoso

        res.status(201).json({ 
            message: 'Venta registrada exitosamente y stock actualizado.', 
            saleId: saleResult.insertId 
        });

    } catch (error) {
        // ¡Aquí es donde estaba el posible problema! Siempre debe ser 'connection.rollback()'
        if (connection) {
            await connection.rollback(); 
        }
        console.error('Error al registrar venta o actualizar stock:', error); // Log del error
        res.status(500).json({ error: 'Error del servidor al registrar la venta.' }); // Envía error JSON
    } finally {
        if (connection) {
            connection.release(); // Libera la conexión de vuelta al pool
        }
    }
});

// Ruta para actualizar una venta existente (si es necesario ajustar cantidad, etc.)
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { cantidad } = req.body;

    if (!cantidad || cantidad <= 0) {
        return res.status(400).json({ error: 'Cantidad válida es requerida para actualizar la venta.' });
    }

    let connection;
    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();

        // Obtener la venta actual para determinar la diferencia de stock
        const [currentSaleRows] = await connection.query('SELECT producto_id, cantidad FROM ventas WHERE id = ? FOR UPDATE', [id]);
        if (currentSaleRows.length === 0) {
            await connection.rollback();
            return res.status(404).json({ error: 'Venta no encontrada.' });
        }
        const currentSale = currentSaleRows[0];
        const oldCantidad = currentSale.cantidad;
        const producto_id = currentSale.producto_id;
        const cantidadDiff = cantidad - oldCantidad; // Diferencia para ajustar el stock

        // Verificar stock si la nueva cantidad es mayor
        if (cantidadDiff > 0) {
            const [productRows] = await connection.query('SELECT stock FROM productos WHERE id = ? FOR UPDATE', [producto_id]);
            if (productRows.length === 0) {
                await connection.rollback();
                return res.status(404).json({ error: 'Producto asociado a la venta no encontrado.' });
            }
            const product = productRows[0];
            if (product.stock < cantidadDiff) {
                await connection.rollback();
                return res.status(400).json({ error: 'Stock insuficiente para aumentar la cantidad de la venta.' });
            }
        }

        // Actualizar la venta
        const [updateResult] = await connection.query(
            'UPDATE ventas SET cantidad = ? WHERE id = ?',
            [cantidad, id]
        );

        if (updateResult.affectedRows === 0) {
            await connection.rollback();
            return res.status(404).json({ error: 'Venta no encontrada o no se pudo actualizar.' });
        }

        // Ajustar el stock del producto
        await connection.query(
            'UPDATE productos SET stock = stock - ? WHERE id = ?',
            [cantidadDiff, producto_id]
        );

        await connection.commit();
        res.json({ message: 'Venta actualizada exitosamente y stock ajustado.' });

    } catch (error) {
        if (connection) {
            await connection.rollback();
        }
        console.error('Error al actualizar venta:', error);
        res.status(500).json({ error: 'Error del servidor al actualizar la venta.' });
    } finally {
        if (connection) {
            connection.release();
        }
    }
});

// Ruta para eliminar una venta
router.delete('/:id', async (req, res) => {
    const { id } = req.params; // Obtiene el ID del parámetro de la URL

    let connection;
    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();

        // Obtener la venta antes de eliminarla para restaurar el stock
        const [saleRows] = await connection.query('SELECT producto_id, cantidad FROM ventas WHERE id = ? FOR UPDATE', [id]);
        if (saleRows.length === 0) {
            await connection.rollback();
            return res.status(404).json({ error: 'Venta no encontrada.' });
        }
        const sale = saleRows[0];

        // Eliminar la venta
        const [deleteResult] = await connection.query('DELETE FROM ventas WHERE id = ?', [id]);

        if (deleteResult.affectedRows === 0) {
            await connection.rollback();
            return res.status(404).json({ error: 'Venta no encontrada o no se pudo eliminar.' });
        }

        // Restaurar el stock del producto
        await connection.query(
            'UPDATE productos SET stock = stock + ? WHERE id = ?',
            [sale.cantidad, sale.producto_id]
        );

        await connection.commit();
        res.json({ message: 'Venta eliminada exitosamente y stock restaurado.' });

    } catch (error) {
        if (connection) {
            await connection.rollback();
        }
        console.error('Error al eliminar venta:', error);
        res.status(500).json({ error: 'Error del servidor al eliminar la venta.' });
    } finally {
        if (connection) {
            connection.release();
        }
    }
});

export default router;
