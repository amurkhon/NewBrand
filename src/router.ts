import express from 'express';
import memberController from './controllers/member.Controller';
import uploader from './libs/utils/uploader';
import { productController } from './controllers/product.Controller';
const router = express.Router();

/* Member */
router.get('/member/mall', memberController.mall);
router.post('/member/signup', memberController.signup);
router.post('/member/login', memberController.login);
router.get(
    '/member/logout', 
    memberController.verifyAuth, 
    memberController.logout
);
router.get(
    '/member/detail',
    memberController.verifyAuth, 
    memberController.getMemberDetail
);
router.post(
    '/member/update',
    memberController.verifyAuth,
    uploader("members").single("memberImage"),
    memberController.updateMember,
);
router.get(
    '/member/top-users',
    memberController.getTopUsers,
);


/* Products */

router.get('/product/all', productController.getProducts);
router.get(
    '/product/:id',
    memberController.retrieveAuth,
    productController.getProduct
);


export default router;