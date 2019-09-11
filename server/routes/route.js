import express from 'express';
import userRoute from './userRoute';
import sessionRoute from './sessionRoute';
import MentorRoute from './mentorRoute';

const router = express.Router();

router.use('/auth', userRoute);

router.use('/sessions', sessionRoute);

router.use('/mentors', MentorRoute);


export default router;
