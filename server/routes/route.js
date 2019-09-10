import express from 'express';
import userRoute from './userRoute';
import sessionRoute from './sessionRoute';

const router = express.Router();

router.use('/auth', userRoute);

router.use('/sessions', sessionRoute);

export default router;
