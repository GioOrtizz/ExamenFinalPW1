import React, { useState, useEffect } from 'react';
import { Product, ProductFormData, Sale, SaleFormData, AuthFormData } from './types'; // Importa las interfaces

// URL base de tu backend. Asegúrate de que coincida con el puerto de tu servidor Express.
const API_BASE_URL = 'http://localhost:3001/api'; // ¡Debe ser 3001!

function App() {
    // Estado para controlar la pestaña activa (se inicializa en 'usuarios' para el login)
    const [activeTab, setActiveTab] = useState<'productos' | 'ventas' | 'usuarios'>('usuarios');
    // Estado para almacenar los productos
    const [products, setProducts] = useState<Product[]>([]);
    // Estado para almacenar las ventas
    const [sales, setSales] = useState<Sale[]>([]);
    // Estado para los mensajes de la aplicación (éxito, error)
    const [message, setMessage] = useState<string>('');
    // Estado para el usuario autenticado (inicialmente null, se establecerá a 'admin' al loguearse)
    const [currentUser, setCurrentUser] = useState<string | null>(null);
    // Estado para manejar la carga de datos
    const [loading, setLoading] = useState<boolean>(false);
    // Estado para manejar errores específicos de formularios
    const [formError, setFormError] = useState<string>('');

    // --- Funciones para Productos ---

    // Función para obtener todos los productos
    const fetchProducts = async () => {
        setLoading(true);
        setFormError('');
        try {
            const response = await fetch(`${API_BASE_URL}/productos`);
            const data: Product[] | { error?: string, message?: string } = await response.json();
            if (response.ok) {
                setProducts(data as Product[]);
            } else {
                const errorData = data as { error?: string, message?: string };
                setMessage(`Error al cargar productos: ${errorData.error || errorData.message}`);
            }
        } catch (error: any) {
            setMessage(`Error de red al cargar productos: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    // Función para agregar un nuevo producto
    const addProduct = async (productData: ProductFormData) => {
        setLoading(true);
        setFormError('');
        try {
            const response = await fetch(`${API_BASE_URL}/productos`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(productData),
            });
            const data: { message?: string, error?: string, productId?: number } = await response.json();
            if (response.ok) {
                setMessage(data.message || 'Producto agregado.');
                fetchProducts();
            } else {
                setFormError(data.message || data.error || 'Error al agregar producto.');
            }
        } catch (error: any) {
            setFormError(`Error de red al agregar producto: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    // Función para actualizar un producto
    const updateProduct = async (id: number, productData: Partial<ProductFormData>) => {
        setLoading(true);
        setFormError('');
        try {
            const response = await fetch(`${API_BASE_URL}/productos/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(productData),
            });
            const data: { message?: string, error?: string } = await response.json();
            if (response.ok) {
                setMessage(data.message || 'Producto actualizado.');
                fetchProducts();
            } else {
                setFormError(data.message || data.error || 'Error al actualizar producto.');
            }
        } catch (error: any) {
            setFormError(`Error de red al actualizar producto: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    // Función para eliminar un producto
    const deleteProduct = async (id: number) => {
        setLoading(true);
        setFormError('');
        try {
            const response = await fetch(`${API_BASE_URL}/productos/${id}`, {
                method: 'DELETE',
            });
            const data: { message?: string, error?: string } = await response.json();
            if (response.ok) {
                setMessage(data.message || 'Producto eliminado.');
                fetchProducts();
            } else {
                setFormError(data.message || data.error || 'Error al eliminar producto.');
            }
        } catch (error: any) {
            setFormError(`Error de red al eliminar producto: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    // --- Funciones para Ventas ---

    // Función para obtener todos los productos
    const fetchSales = async () => {
        setLoading(true);
        setFormError('');
        try {
            const response = await fetch(`${API_BASE_URL}/ventas`);
            const data: Sale[] | { error?: string, message?: string } = await response.json();
            if (response.ok) {
                setSales(data as Sale[]);
            } else {
                const errorData = data as { error?: string, message?: string };
                setMessage(`Error al cargar ventas: ${errorData.error || errorData.message}`);
            }
        } catch (error: any) {
            setMessage(`Error de red al cargar ventas: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    // Función para agregar un nuevo producto
    const addSale = async (saleData: SaleFormData) => {
        setLoading(true);
        setFormError('');
        try {
            const response = await fetch(`${API_BASE_URL}/ventas`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(saleData),
            });
            const data: { message?: string, error?: string, saleId?: number } = await response.json();
            if (response.ok) {
                setMessage(data.message || 'Venta registrada.');
                fetchSales();
                fetchProducts(); // Recargar productos para ver el stock actualizado
            } else {
                setFormError(data.message || data.error || 'Error al registrar venta.');
            }
        } catch (error: any) {
            setFormError(`Error de red al registrar venta: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    // Función para actualizar un producto
    const updateSale = async (id: number, saleData: Partial<SaleFormData>) => {
        setLoading(true);
        setFormError('');
        try {
            const response = await fetch(`${API_BASE_URL}/ventas/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(saleData),
            });
            const data: { message?: string, error?: string } = await response.json();
            if (response.ok) {
                setMessage(data.message || 'Venta actualizada.');
                fetchSales();
                fetchProducts(); // Recargar productos para ver el stock actualizado
            } else {
                setFormError(data.message || data.error || 'Error al actualizar venta.');
            }
        } catch (error: any) {
                setFormError(`Error de red al actualizar venta: ${error.message}`);
            } finally {
                setLoading(false);
            }
        };

        // Función para eliminar un producto
        const deleteSale = async (id: number) => {
            setLoading(true);
            setFormError('');
            try {
                const response = await fetch(`${API_BASE_URL}/ventas/${id}`, {
                    method: 'DELETE',
                });
                const data: { message?: string, error?: string } = await response.json();
                if (response.ok) {
                    setMessage(data.message || 'Venta eliminada.');
                    fetchSales();
                    fetchProducts(); // Recargar productos para ver el stock actualizado
                } else {
                    setFormError(data.message || data.error || 'Error al eliminar venta.');
                }
            } catch (error: any) {
                setFormError(`Error de red al eliminar venta: ${error.message}`);
            } finally {
                setLoading(false);
            }
        };

        // --- Funciones para Usuarios (Autenticación) ---

        // Función para iniciar sesión (ahora maneja el usuario 'admin' hardcodeado)
        const loginUser = async (credentials: AuthFormData) => {
            setLoading(true);
            setFormError('');
            const { usuario, contraseña } = credentials;

            // Lógica para el usuario 'admin' hardcodeado
            if (usuario === 'admin' && contraseña === '12345') {
                setMessage('Login exitoso como admin.');
                setCurrentUser('admin');
                setLoading(false);
                setActiveTab('productos'); // Redirige a la pestaña de productos después del login
                return;
            }

            // Para cualquier otro usuario, intenta autenticar con el backend (si quieres permitir otros usuarios en el futuro)
            try {
                const response = await fetch(`${API_BASE_URL}/usuarios/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(credentials),
                });
                const data: { message?: string, error?: string, usuario?: string } = await response.json();
                if (response.ok) {
                    setMessage(data.message || 'Login exitoso.');
                    setCurrentUser(data.usuario || null);
                    setActiveTab('productos'); // Redirige a la pestaña de productos después del login
                } else {
                    setFormError(data.error || data.message || 'Error al iniciar sesión.');
                    setCurrentUser(null);
                }
            } catch (error: any) {
                setFormError(`Error de red al iniciar sesión: ${error.message}`);
                setCurrentUser(null);
            } finally {
                setLoading(false);
            }
        };

        // Función para cerrar sesión
        const logoutUser = () => {
            setCurrentUser(null);
            setMessage('Sesión cerrada.');
            setFormError('');
            setActiveTab('usuarios'); // Vuelve a la pantalla de login
        };

        // Efecto para cargar productos y ventas cuando el componente se monta
        useEffect(() => {
            if (currentUser) { // Solo si hay un usuario logueado, carga los datos
                fetchProducts();
                fetchSales();
            }
        }, [currentUser]); // Se ejecuta cuando currentUser cambia

        // Componente de formulario genérico para productos (Agregar/Editar)
        const ProductForm: React.FC<{ product?: Product; onSubmit: (data: ProductFormData) => void; buttonText: string }> = ({ product, onSubmit, buttonText }) => {
            const [formData, setFormData] = useState<ProductFormData>({
                nombre: product?.nombre || '',
                descripcion: product?.descripcion || '',
                precio: product?.precio || 0,
                stock: product?.stock || 0,
                categoria: product?.categoria || '',
            });

            const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
                const { name, value } = e.target;
                setFormData({ ...formData, [name]: (name === 'precio' || name === 'stock') ? parseFloat(value) || 0 : value });
            };

            const handleSubmit = (e: React.FormEvent) => {
                e.preventDefault();
                onSubmit(formData);
            };

            return (
                <form onSubmit={handleSubmit} className="p-6 bg-white rounded-xl shadow-2xl mb-8">
                    <h3 className="text-2xl font-bold mb-6 text-gray-800">
                        {product ? 'Editar Producto' : 'Agregar Nuevo Producto'}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <input
                            type="text"
                            name="nombre"
                            placeholder="Nombre del Producto"
                            value={formData.nombre}
                            onChange={handleChange}
                            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-300 transition duration-200"
                            required
                        />
                        <input
                            type="text"
                            name="descripcion"
                            placeholder="Descripción"
                            value={formData.descripcion}
                            onChange={handleChange}
                            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-300 transition duration-200"
                        />
                        <input
                            type="number"
                            name="precio"
                            placeholder="Precio"
                            value={formData.precio}
                            onChange={handleChange}
                            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-300 transition duration-200"
                            step="0.01"
                            required
                        />
                        <input
                            type="number"
                            name="stock"
                            placeholder="Stock"
                            value={formData.stock}
                            onChange={handleChange}
                            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-300 transition duration-200"
                            required
                        />
                        <input
                            type="text"
                            name="categoria"
                            placeholder="Categoría"
                            value={formData.categoria}
                            onChange={handleChange}
                            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-300 transition duration-200"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-4 rounded-xl hover:from-blue-600 hover:to-cyan-600 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 shadow-lg hover:shadow-xl font-bold text-lg"
                    >
                        {buttonText}
                    </button>
                </form>
            );
        };

        // Componente de formulario para agregar ventas
        const AddSaleForm: React.FC<{ products: Product[]; onSubmit: (data: SaleFormData) => void }> = ({ products, onSubmit }) => {
            const [formData, setFormData] = useState<SaleFormData>({
                producto_id: 0,
                cantidad: 0,
            });

            const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
                const { name, value } = e.target;
                setFormData({ ...formData, [name]: parseInt(value) || 0 });
            };

            const handleSubmit = (e: React.FormEvent) => {
                e.preventDefault();
                onSubmit(formData);
                setFormData({ producto_id: 0, cantidad: 0 });
            };

            return (
                <form onSubmit={handleSubmit} className="p-6 bg-white rounded-xl shadow-2xl mb-8">
                    <h3 className="text-2xl font-bold mb-6 text-gray-800">Registrar Nueva Venta</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <select
                            name="producto_id"
                            value={formData.producto_id}
                            onChange={handleChange}
                            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-300 transition duration-200"
                            required
                        >
                            <option value="">Selecciona un Producto</option>
                            {products.map((product) => (
                                <option key={product.id} value={product.id}>
                                    {product.nombre} (Stock: {product.stock})
                                </option>
                            ))}
                        </select>
                        <input
                            type="number"
                            name="cantidad"
                            placeholder="Cantidad"
                            value={formData.cantidad}
                            onChange={handleChange}
                            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-300 transition duration-200"
                            required
                            min="1"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-green-500 to-teal-500 text-white p-4 rounded-xl hover:from-green-600 hover:to-teal-600 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 shadow-lg hover:shadow-xl font-bold text-lg"
                    >
                        Registrar Venta
                    </button>
                </form>
            );
        };

        // Componente de formulario para autenticación (solo Login ahora)
        // Se le pasa un 'formIdPrefix' para asegurar IDs y nombres únicos
        const AuthForm: React.FC<{ onSubmit: (data: AuthFormData) => void; formIdPrefix: string }> = ({ onSubmit, formIdPrefix }) => {
            const [formData, setFormData] = useState<AuthFormData>({
                usuario: '',
                contraseña: '',
            });

            const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                const { name, value } = e.target;
                setFormData({ ...formData, [name]: value });
            };

            const handleSubmit = (e: React.FormEvent) => {
                e.preventDefault();
                onSubmit(formData);
                setFormData({ usuario: '', contraseña: '' }); // Limpiar formulario
            };

            return (
                <form onSubmit={handleSubmit} className="p-8 bg-white rounded-xl shadow-2xl max-w-md mx-auto transform transition-all duration-300 hover:scale-105 hover:shadow-3xl">
                    <h3 className="text-3xl font-extrabold mb-8 text-center text-gray-900 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
                        Iniciar Sesión
                    </h3>
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor={`${formIdPrefix}-usuario`}>
                            Usuario:
                        </label>
                        <input
                            type="text"
                            name="usuario"
                            id={`${formIdPrefix}-usuario`}
                            placeholder="usuario" 
                            value={formData.usuario}
                            onChange={handleChange}
                            className="shadow-inner appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none focus:ring-4 focus:ring-indigo-300 transition duration-200"
                            required
                        />
                    </div>
                    <div className="mb-8">
                        <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor={`${formIdPrefix}-contraseña`}>
                            Contraseña:
                        </label>
                        <input
                            type="password" // CAMBIO CLAVE: Tipo "password" para ocultar el texto
                            name="contraseña"
                            id={`${formIdPrefix}-contraseña`}
                            placeholder="••••••••" 
                            value={formData.contraseña}
                            onChange={handleChange}
                            className="shadow-inner appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-800 mb-3 leading-tight focus:outline-none focus:shadow-outline focus:ring-4 focus:ring-indigo-300 transition duration-200"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-xl focus:outline-none focus:shadow-outline w-full transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 shadow-lg hover:shadow-xl"
                    >
                        Iniciar Sesión
                    </button>
                </form>
            );
        };


        // Estado para el producto que se está editando
        const [editingProduct, setEditingProduct] = useState<Product | null>(null);
        // Estado para la venta que se está editando
        const [editingSale, setEditingSale] = useState<Sale | null>(null);

        // Función para manejar la edición de un producto
        const handleEditProduct = (product: Product) => {
            setEditingProduct(product);
            setMessage('');
            setFormError('');
        };

        // Función para cancelar la edición de un producto
        const handleCancelEditProduct = () => {
            setEditingProduct(null);
            setMessage('');
            setFormError('');
        };

        // Función para manejar la edición de una venta
        const handleEditSale = (sale: Sale) => {
            setEditingSale(sale);
            setMessage('');
            setFormError('');
        };

        // Función para cancelar la edición de una venta
        const handleCancelEditSale = () => {
            setEditingSale(null);
            setMessage('');
            setFormError('');
        };

        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col items-center py-12 font-inter text-gray-800">
                <header className="w-full max-w-7xl bg-gradient-to-r from-blue-700 to-indigo-700 text-white p-8 rounded-2xl shadow-3xl mb-12 transform transition-all duration-500 hover:scale-102">
                    <h1 className="text-5xl font-extrabold text-center mb-6 drop-shadow-lg">
                        <span className="bg-gradient-to-r from-purple-300 to-pink-300 text-transparent bg-clip-text">
                            Tienda de Ropa
                        </span> - Gestión de Inventario
                    </h1>
                    {currentUser && ( // Solo muestra la navegación si hay un usuario logueado
                        <nav className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-8">
                            <button
                                onClick={() => setActiveTab('productos')}
                                className={`px-8 py-4 rounded-xl text-xl font-bold transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 shadow-lg hover:shadow-xl
                                    ${activeTab === 'productos'
                                        ? 'bg-indigo-900 text-white border-2 border-purple-400'
                                        : 'bg-indigo-700 hover:bg-indigo-800 text-indigo-100 border-2 border-transparent'
                                }`}
                            >
                                Productos
                            </button>
                            <button
                                onClick={() => setActiveTab('ventas')}
                                className={`px-8 py-4 rounded-xl text-xl font-bold transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 shadow-lg hover:shadow-xl
                                    ${activeTab === 'ventas'
                                        ? 'bg-indigo-900 text-white border-2 border-purple-400'
                                        : 'bg-indigo-700 hover:bg-indigo-800 text-indigo-100 border-2 border-transparent'
                                }`}
                            >
                                Ventas
                            </button>
                            <button
                                onClick={() => setActiveTab('usuarios')}
                                className={`px-8 py-4 rounded-xl text-xl font-bold transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 shadow-lg hover:shadow-xl
                                    ${activeTab === 'usuarios'
                                        ? 'bg-indigo-900 text-white border-2 border-purple-400'
                                        : 'bg-indigo-700 hover:bg-indigo-800 text-indigo-100 border-2 border-transparent'
                                }`}
                            >
                                Usuarios
                            </button>
                        </nav>
                    )}
                </header>

                <main className="w-full max-w-7xl bg-white p-10 rounded-2xl shadow-3xl">
                    {/* Mensajes de la aplicación */}
                    {message && (
                        <div className="bg-green-100 border border-green-400 text-green-700 px-6 py-4 rounded-lg relative mb-6 shadow-md" role="alert">
                            <strong className="font-bold">¡Éxito!</strong>
                            <span className="block sm:inline ml-2"> {message}</span>
                            <span className="absolute top-0 bottom-0 right-0 px-4 py-3 cursor-pointer" onClick={() => setMessage('')}>
                                <svg className="fill-current h-6 w-6 text-green-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Cerrar</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.697l-2.651 2.652a1.2 1.2 0 1 1-1.697-1.697L8.303 10 5.651 7.348a1.2 1.2 0 1 1 1.697-1.697L10 8.303l2.651-2.652a1.2 1.2 0 0 1 1.697 1.697L11.697 10l2.651 2.651a1.2 1.2 0 0 1 0 1.698z"/></svg>
                            </span>
                        </div>
                    )}
                    {formError && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg relative mb-6 shadow-md" role="alert">
                            <strong className="font-bold">¡Error!</strong>
                            <span className="block sm:inline ml-2"> {formError}</span>
                            <span className="absolute top-0 bottom-0 right-0 px-4 py-3 cursor-pointer" onClick={() => setFormError('')}>
                                <svg className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Cerrar</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.697l-2.651 2.652a1.2 1.2 0 1 1-1.697-1.697L8.303 10 5.651 7.348a1.2 1.2 0 1 1 1.697-1.697L10 8.303l2.651-2.652a1.2 1.2 0 0 1 1.697 1.697L11.697 10l2.651 2.651a1.2 1.2 0 0 1 0 1.698z"/></svg>
                            </span>
                        </div>
                    )}
                    {loading && (
                        <div className="flex justify-center items-center mb-6">
                            <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-blue-500"></div>
                            <span className="ml-4 text-lg font-semibold text-gray-700">Cargando...</span>
                        </div>
                    )}

                    {!currentUser ? ( // Si no hay usuario logueado, muestra solo el formulario de login
                        <div className="flex justify-center items-center min-h-[60vh]"> {/* Ajusta la altura para centrar */}
                            <AuthForm onSubmit={loginUser} formIdPrefix="login" />
                        </div>
                    ) : ( // Si hay usuario logueado, muestra la interfaz completa
                        <>
                            {/* Contenido de la pestaña Usuarios (ahora solo muestra el mensaje de bienvenida) */}
                            {activeTab === 'usuarios' && (
                                <div>
                                    <h2 className="text-4xl font-extrabold mb-10 text-gray-900 text-center bg-clip-text text-transparent bg-gradient-to-r from-teal-500 to-green-500">
                                        Gestión de Usuarios
                                    </h2>
                                    <div className="text-center p-10 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-2xl max-w-lg mx-auto transform transition-all duration-300 hover:scale-105">
                                        <p className="text-3xl font-bold text-indigo-800 mb-6">¡Bienvenido, {currentUser}!</p>
                                        <button
                                            onClick={logoutUser}
                                            className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-bold py-3 px-8 rounded-xl focus:outline-none focus:shadow-outline transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 shadow-lg hover:shadow-xl text-lg"
                                        >
                                            Cerrar Sesión
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Contenido de la pestaña Productos */}
                            {activeTab === 'productos' && (
                                <div>
                                    <h2 className="text-4xl font-extrabold mb-10 text-gray-900 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-cyan-500">
                                        Gestión de Productos
                                    </h2>
                                    {editingProduct ? (
                                        <div className="mb-10 p-6 bg-blue-50 rounded-xl shadow-lg border border-blue-200">
                                            <ProductForm
                                                product={editingProduct}
                                                onSubmit={(data) => {
                                                    updateProduct(editingProduct.id, data);
                                                    setEditingProduct(null); // Salir del modo edición
                                                }}
                                                buttonText="Actualizar Producto"
                                            />
                                            <button
                                                onClick={handleCancelEditProduct}
                                                className="mt-4 w-full bg-gray-500 text-white p-3 rounded-xl hover:bg-gray-600 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 shadow-md font-bold"
                                            >
                                                Cancelar Edición
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="mb-10">
                                            <ProductForm onSubmit={addProduct} buttonText="Agregar Producto" />
                                        </div>
                                    )}

                                    <h3 className="text-3xl font-bold mb-6 text-gray-800 text-center">Listado de Productos</h3>
                                    {products.length === 0 ? (
                                        <p className="text-gray-600 text-center text-lg py-8">No hay productos registrados.</p>
                                    ) : (
                                        <div className="overflow-x-auto rounded-xl shadow-xl">
                                            <table className="min-w-full bg-white border border-gray-200">
                                                <thead className="bg-gradient-to-r from-blue-100 to-indigo-100">
                                                    <tr>
                                                        <th className="py-4 px-6 border-b text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">ID</th>
                                                        <th className="py-4 px-6 border-b text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Nombre</th>
                                                        <th className="py-4 px-6 border-b text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Descripción</th>
                                                        <th className="py-4 px-6 border-b text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Precio</th>
                                                        <th className="py-4 px-6 border-b text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Stock</th>
                                                        <th className="py-4 px-6 border-b text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Categoría</th>
                                                        <th className="py-4 px-6 border-b text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Acciones</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {products.map((product, index) => (
                                                        <tr key={product.id} className={`hover:bg-blue-50 transition duration-150 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                                            <td className="py-4 px-6 border-b text-gray-800">{product.id}</td>
                                                            <td className="py-4 px-6 border-b text-gray-800 font-medium">{product.nombre}</td>
                                                            <td className="py-4 px-6 border-b text-gray-700 text-sm">{product.descripcion}</td>
                                                            <td className="py-4 px-6 border-b text-gray-800 font-semibold">
                                                                {`$${Number(product.precio || 0).toFixed(2)}`}
                                                            </td>
                                                            <td className="py-4 px-6 border-b text-gray-800">{product.stock}</td>
                                                            <td className="py-4 px-6 border-b text-gray-700 text-sm">{product.categoria}</td>
                                                            <td className="py-4 px-6 border-b">
                                                                <button
                                                                    onClick={() => handleEditProduct(product)}
                                                                    className="bg-yellow-500 text-white p-2 rounded-md hover:bg-yellow-600 mr-2 transition duration-200 ease-in-out transform hover:scale-105 shadow-sm"
                                                                >
                                                                    Editar
                                                                </button>
                                                                <button
                                                                    onClick={() => deleteProduct(product.id)}
                                                                    className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600 transition duration-200 ease-in-out transform hover:scale-105 shadow-sm"
                                                                >
                                                                    Eliminar
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Contenido de la pestaña Ventas */}
                            {activeTab === 'ventas' && (
                                <div>
                                    <h2 className="text-4xl font-extrabold mb-10 text-gray-900 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500">
                                        Gestión de Ventas
                                    </h2>
                                    {editingSale ? (
                                        <div className="mb-10 p-6 bg-purple-50 rounded-xl shadow-lg border border-purple-200">
                                            <h3 className="text-2xl font-bold mb-6 text-gray-800">Editar Venta</h3>
                                            <form onSubmit={(e: React.FormEvent) => {
                                                e.preventDefault();
                                                const target = e.target as typeof e.target & {
                                                    cantidad: { value: string };
                                                };
                                                updateSale(editingSale.venta_id, { cantidad: parseInt(target.cantidad.value) });
                                                setEditingSale(null);
                                            }} className="p-4 bg-white rounded-xl shadow-inner mb-6">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                                    <p className="p-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-700 font-medium">Producto: {editingSale.producto_nombre}</p>
                                                    <input
                                                        type="number"
                                                        name="cantidad"
                                                        placeholder="Nueva Cantidad"
                                                        defaultValue={editingSale.cantidad}
                                                        className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-purple-300 transition duration-200"
                                                        required
                                                        min="1"
                                                    />
                                                </div>
                                                <button
                                                    type="submit"
                                                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 rounded-xl hover:from-purple-600 hover:to-pink-600 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 shadow-lg font-bold text-lg"
                                                >
                                                    Actualizar Venta
                                                </button>
                                                <button
                                                    onClick={handleCancelEditSale}
                                                    className="mt-4 w-full bg-gray-500 text-white p-3 rounded-xl hover:bg-gray-600 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 shadow-md font-bold"
                                                >
                                                    Cancelar Edición
                                                </button>
                                            </form>
                                        </div>
                                    ) : (
                                        <div className="mb-10">
                                            <AddSaleForm products={products} onSubmit={addSale} />
                                        </div>
                                    )}

                                    <h3 className="text-3xl font-bold mb-6 text-gray-800 text-center">Listado de Ventas</h3>
                                    {sales.length === 0 ? (
                                        <p className="text-gray-600 text-center text-lg py-8">No hay ventas registradas.</p>
                                    ) : (
                                        <div className="overflow-x-auto rounded-xl shadow-xl">
                                            <table className="min-w-full bg-white border border-gray-200">
                                                <thead className="bg-gradient-to-r from-purple-100 to-pink-100">
                                                    <tr>
                                                        <th className="py-4 px-6 border-b text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">ID Venta</th>
                                                        <th className="py-4 px-6 border-b text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Producto</th>
                                                        <th className="py-4 px-6 border-b text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Cantidad</th>
                                                        <th className="py-4 px-6 border-b text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Precio Unitario</th>
                                                        <th className="py-4 px-6 border-b text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Total Venta</th>
                                                        <th className="py-4 px-6 border-b text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Fecha Venta</th>
                                                        <th className="py-4 px-6 border-b text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Acciones</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {sales.map((sale, index) => (
                                                        <tr key={sale.venta_id} className={`hover:bg-purple-50 transition duration-150 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                                            <td className="py-4 px-6 border-b text-gray-800">{sale.venta_id}</td>
                                                            <td className="py-4 px-6 border-b text-gray-800 font-medium">{sale.producto_nombre}</td>
                                                            <td className="py-4 px-6 border-b text-gray-800">{sale.cantidad}</td>
                                                            <td className="py-4 px-6 border-b text-gray-800 font-semibold">
                                                                {`$${Number(sale.producto_precio || 0).toFixed(2)}`}
                                                            </td>
                                                            <td className="py-4 px-6 border-b text-gray-800 font-semibold">
                                                                {`$${(Number(sale.cantidad || 0) * Number(sale.producto_precio || 0)).toFixed(2)}`}
                                                            </td>
                                                            <td className="py-4 px-6 border-b text-gray-700 text-sm">{new Date(sale.fecha_venta).toLocaleString()}</td>
                                                            <td className="py-4 px-6 border-b">
                                                                <button
                                                                    onClick={() => handleEditSale(sale)}
                                                                    className="bg-yellow-500 text-white p-2 rounded-md hover:bg-yellow-600 mr-2 transition duration-200 ease-in-out transform hover:scale-105 shadow-sm"
                                                                >
                                                                    Editar
                                                                </button>
                                                                <button
                                                                    onClick={() => deleteSale(sale.venta_id)}
                                                                    className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600 transition duration-200 ease-in-out transform hover:scale-105 shadow-sm"
                                                                >
                                                                    Eliminar
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>
                            )}
                        </>
                    )}
                </main>
            </div>
        );
    }

    export default App;
