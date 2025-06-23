import express from 'express';
import mallController from './controllers/mall.Controller';

const routerAdmin = express.Router();

/** Restaurant */
routerAdmin.get('/', mallController.goHome);

routerAdmin
    .get('/signup', mallController.getSignup)
    .post('/signup', mallController.processSignup);

routerAdmin
    .get('/login', mallController.getLogin)
    .post('/login', mallController.processLogin);


routerAdmin.get('/check-me', mallController.checkAuthSession);

export default routerAdmin;