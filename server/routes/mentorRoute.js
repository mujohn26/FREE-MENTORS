import express from 'express';
import userController from '../controllers/userController';
import verify from '../middleware/autho';

const { verifyUser } = verify;

const router = express.Router();


export default router;
