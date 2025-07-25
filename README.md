✨ Sistema de Gestión de Inventario para Tienda de Ropa ✨
Este proyecto es un sistema básico de gestión de inventario para una tienda de ropa, desarrollado con un frontend en React.js (TypeScript) y un backend en Node.js (Express.js), utilizando MySQL/MariaDB como base de datos. Permite la gestión completa de productos y ventas, incluyendo autenticación de usuarios y la generación de reportes detallados.

🛠️ Tecnologías Utilizadas
Frontend:
⚛️ React.js: Biblioteca líder para construir interfaces de usuario interactivas.

📝 TypeScript: Un superset de JavaScript que añade tipado estático, mejorando la robustez del código.

⚡ Vite: Una herramienta de construcción moderna y rápida para proyectos frontend, optimizando el desarrollo.

🎨 Tailwind CSS: Un framework CSS utilitario para un diseño rápido, flexible y completamente responsivo.

Backend:
🟢 Node.js: Entorno de ejecución de JavaScript del lado del servidor.

🌐 Express.js: Un framework web minimalista y flexible para Node.js, ideal para construir APIs.

🗄️ MySQL/MariaDB: Sistema de gestión de bases de datos relacionales robusto y popular.

🔗 mysql2/promise: Cliente MySQL para Node.js con soporte nativo para promesas, facilitando las operaciones asíncronas con la base de datos.

CORS: Middleware para habilitar Cross-Origin Resource Sharing, permitiendo la comunicación segura entre frontend y backend.

Body-parser: Middleware para parsear cuerpos de solicitud JSON, fundamental para recibir datos del frontend.

Dotenv: Para cargar variables de entorno desde un archivo .env, manteniendo la configuración sensible fuera del código fuente.

⚙️ Configuración de la Base de Datos
Para que la aplicación funcione correctamente, primero debes configurar tu base de datos MySQL/MariaDB.

Instala MySQL o MariaDB en tu sistema. Puedes usar soluciones como XAMPP, WAMP, MAMP o instalar el servidor de base de datos directamente.

Crea una nueva base de datos. Te sugerimos llamarla tienda_ropa.

CREATE DATABASE IF NOT EXISTS tienda_ropa;
USE tienda_ropa;

Crea las tablas productos y ventas ejecutando el siguiente script SQL en tu base de datos:

-- Tabla de Productos
CREATE TABLE IF NOT EXISTS productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10, 2) NOT NULL,
    stock INT NOT NULL,
    categoria VARCHAR(100),
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Ventas
CREATE TABLE IF NOT EXISTS ventas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    producto_id INT NOT NULL,
    cantidad INT NOT NULL,
    fecha_venta TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE RESTRICT
);

-- Datos de ejemplo (opcional) para empezar con algunos productos
INSERT INTO productos (nombre, descripcion, precio, stock, categoria) VALUES
('Camiseta Básica', 'Camiseta de algodón suave y cómoda', 19.99, 100, 'Camisetas'),
('Pantalón Vaquero', 'Vaqueros ajustados de mezclilla azul', 49.99, 50, 'Pantalones'),
('Vestido Floral', 'Vestido ligero con estampado floral', 35.50, 75, 'Vestidos'),
('Chaqueta de Cuero', 'Chaqueta de cuero sintético negra', 89.00, 20, 'Chaquetas');

Configura las variables de entorno del Backend:

En la carpeta backend, crea un archivo llamado .env (si no existe, puedes copiar .env.example y renombrarlo).

Asegúrate de que contenga la información de tu base de datos y el puerto del servidor, adaptándolo a tu configuración local:

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=TU_CONTRASENA_MYSQL
DB_DATABASE=tienda_ropa
DB_PORT=3306
PORT=3001

⚠️ Importante: Reemplaza TU_CONTRASENA_MYSQL con la contraseña real de tu usuario de MySQL/MariaDB.

🚀 Instalación y Ejecución
Sigue estos pasos para instalar y ejecutar tanto el backend como el frontend de tu aplicación.

1. Backend
Abre tu terminal y navega hasta la carpeta backend de tu proyecto:

cd ExamenFinalPW1/backend

Instala todas las dependencias necesarias para el backend:

npm install

Inicia el servidor backend:

npm start

El servidor se ejecutará en http://localhost:3001. Deberías ver un mensaje en la terminal indicando que el servidor está corriendo y que la conexión a la base de datos se estableció correctamente.

2. Frontend
Abre una nueva terminal (mantén la del backend abierta) y navega hasta la carpeta frontend-tienda-ropa de tu proyecto:

cd ExamenFinalPW1/frontend-tienda-ropa

Instala todas las dependencias necesarias para el frontend:

npm install

Inicia la aplicación React:

npm run dev

La aplicación se abrirá automáticamente en tu navegador en http://localhost:5173.

🖥️ Funcionalidades Principales y Módulos CRUD
🔐 Autenticación
Acceso: La aplicación cuenta con una pantalla de login para restringir el acceso. Para ingresar a las funcionalidades de gestión, utiliza las siguientes credenciales:

Usuario: admin

Contraseña: 12345

👕 Gestión de Productos (CRUD)
Ubicación: Accede a esta sección desde la pestaña "Productos" en la barra de navegación.

Crear (Add): Utiliza el formulario "Agregar Nuevo Producto" para incorporar nuevos ítems al inventario, especificando su nombre, descripción, precio, stock y categoría.

Leer (Read): La tabla "Listado de Productos" te permite visualizar en tiempo real todos los productos disponibles en el inventario, con sus detalles actualizados.

Actualizar (Update): Haz clic en el botón "Editar" junto a cualquier producto en la tabla. El formulario se precargará con los datos del producto seleccionado, permitiéndote modificarlos fácilmente.

Eliminar (Delete): Haz clic en el botón "Eliminar" junto a un producto para borrarlo permanentemente del inventario.

💰 Gestión de Ventas (CRUD)
Ubicación: Accede a esta sección desde la pestaña "Ventas" en la barra de navegación.

Crear (Add): Utiliza el formulario "Registrar Nueva Venta". Selecciona un producto del desplegable e introduce la cantidad deseada. El sistema validará el stock disponible y, si es suficiente, registrará la venta y descontará automáticamente el stock del producto vendido.

Leer (Read): La tabla "Listado de Ventas" muestra un registro completo de todas las transacciones realizadas, incluyendo el nombre del producto, la cantidad vendida y el precio total de la venta.

Actualizar (Update): Haz clic en el botón "Editar" junto a una venta para ajustar la cantidad vendida. El sistema ajustará el stock del producto en consecuencia (sumando o restando la diferencia según el cambio).

Eliminar (Delete): Haz clic en el botón "Eliminar" junto a una venta para cancelarla. El sistema restaurará la cantidad vendida al stock del producto correspondiente en el inventario.

📊 Generación de Reportes de Ventas
La aplicación incluye una potente funcionalidad para generar un resumen ejecutivo de tus ventas.

Accede a la Pestaña "Ventas" después de iniciar sesión.

Dentro de esta pestaña, encontrarás una sección claramente identificada como "Generar Reporte de Ventas".

Haz clic en el botón "Generar Reporte".

La aplicación realizará una petición al backend, y el resumen del reporte se mostrará directamente en la interfaz. Este reporte incluye información clave como:

Total de Ventas Registradas: La cantidad total de transacciones de venta.

Total de Ítems Vendidos: La suma de todas las unidades de productos que se han vendido.

Valor Total de Ventas: El ingreso monetario total generado por todas las ventas.

Top 5 Productos Más Vendidos: Un listado de los 5 productos que han vendido la mayor cantidad de unidades, junto con la cantidad específica y el valor total que han generado.

🧑‍💻 Autor
Nombre: Giovanni Ortiz
