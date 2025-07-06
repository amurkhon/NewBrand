import express from 'express';
import mallController from './controllers/mall.Controller';
import { productController } from './controllers/product.Controller';

const routerAdmin = express.Router();

/** Restaurant */
routerAdmin.get('/', mallController.goHome);

routerAdmin
    .get('/signup', mallController.getSignup)
    .post('/signup', mallController.processSignup);

routerAdmin
    .get('/login', mallController.getLogin)
    .post('/login', mallController.processLogin);

routerAdmin.get('/logout', mallController.logout);
routerAdmin.get('/check-me', mallController.checkAuthSession);

/* User */
routerAdmin
    .get(
        '/user/all',
        mallController.verifyMall,
        mallController.getUsers,
    );
routerAdmin.post(
    '/user/edit',
    mallController.verifyMall,
    mallController.updateChosenUser,
);

/* Product */

routerAdmin.get('/product/all', productController.getAllProducts);

export default routerAdmin;