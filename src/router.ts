import express from 'express';
import memberController from './controllers/member.Controller';
const router = express.Router();

/* Member */
router.post('/signup', memberController.signup);
router.post('/login', memberController.login);
router.get(
    '/logout', 
    memberController.verifyAuth, 
    memberController.logout
);
router.get(
    '/member/detail',
    memberController.verifyAuth, 
    memberController.getMemberDetail
);



export default router;