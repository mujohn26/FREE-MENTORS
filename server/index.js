import express from 'express';
import bodyParse from 'body-parser';
import dotenv from 'dotenv';
import userRoute from './routes/user_route';
import MentorRoute from './routes/Mentor-route';
// import errorhandler from './middleware/error_handler';
import status from './helpers/StatusCode';


dotenv.config();
console.log(`Our secret: ${process.env.freeMentors_jwtSecret}`);

const app = express();
app.use(bodyParse.json());
// Custom path: For signin and signup endpoints
app.use('/api/v1/auth', userRoute);
// view mentors
app.use('/api/v1/mentors', MentorRoute);
// Default page
app.use('/', (req, res) => {
  res.status(status.NOT_FOUND).send({
    status: status.NOT_FOUND,
    error: 'Incorrect route',
  });
});
// app.use(errorhandler);


const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Listening on port ${port}...`));
export default app;
