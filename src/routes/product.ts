import { Router } from 'express';
import * as productController from '../controller/products';
import { checkAuth } from '../middleware/auth';
// import {checkAuth} from '../middleware/auth'
const router = Router();

router.post('/', checkAuth('add_product'),productController.createProduct);
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);
router.put('/:id', checkAuth('update_product'),productController.updateProduct);
router.delete('/:id',checkAuth('delete_product'), productController.deleteProduct);
router.post('/buy',checkAuth(), productController.buyProducts);

export default router;
