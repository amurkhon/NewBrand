import express from 'express';
import memberController from './controllers/member.Controller';
const router = express.Router();

/* MALL */

router.get('/', memberController.goHome);

router.get('/signup', memberController.getSignup);

router.get('/login', memberController.getLogin);


export default router;