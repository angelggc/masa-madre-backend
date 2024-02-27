import { Router } from 'express';
import { login, register } from "../controllers/auth-controller";
import { checkLogin } from '../middlewares/auth-middleware';
const router = Router();

router
  .post('/register', register)
  .post('/login',checkLogin, login)


  export default router;