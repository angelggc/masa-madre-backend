import express from 'express';
import { createProduct, getAllProducts, getProductById, updateProductById, deleteProductById } from '../controllers/products-controller';

const router = express.Router();

// Rutas para CRUD de productos
router.post('/products', createProduct); // Crear un nuevo producto
router.get('/', getAllProducts); // Obtener todos los productos
router.get('/:productId', getProductById); // Obtener un producto por su ID
router.put('/:productId', updateProductById); // Actualizar un producto por su ID
router.delete('/:productId', deleteProductById); // Eliminar un producto por su ID

export default router;
