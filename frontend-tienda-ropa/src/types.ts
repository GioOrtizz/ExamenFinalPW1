// src/types.ts

// Interfaz para los datos de un producto tal como se reciben del backend
export interface Product {
    id: number;
    nombre: string;
    descripcion: string;
    precio: number;
    stock: number;
    categoria: string;
}

// Interfaz para los datos de un producto cuando se envían desde un formulario (sin ID)
export interface ProductFormData {
    nombre: string;
    descripcion: string;
    precio: number;
    stock: number;
    categoria: string;
}

// Interfaz para los datos de una venta tal como se reciben del backend
export interface Sale {
    venta_id: number;
    producto_id: number;
    cantidad: number;
    fecha_venta: string; // O Date si lo parseas
    producto_nombre: string;
    producto_descripcion: string;
    producto_precio: number;
    producto_categoria: string;
}

// Interfaz para los datos de una venta cuando se envían desde un formulario (solo ID de producto y cantidad)
export interface SaleFormData {
    producto_id: number;
    cantidad: number;
}

// Interfaz para los datos de autenticación (registro/login)
export interface AuthFormData {
    usuario: string;
    contraseña: string;
}
