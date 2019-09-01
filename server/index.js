import express from 'express';
import bodyParse from 'body-parser';
import dotenv from 'dotenv';
import userRoute from './routes/user_route';
import MentorRoute from './routes/Mentor-route';
import sessionRoute from './routes/session-route';

// import errorhandler from './middleware/error_handler';
import status from './helpers/StatusCode';

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger.json');

dotenv.config();

const app = express();
app.use(bodyParse.json());
// APi Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
// Custom path: For signin and signup endpoints
app.use('/api/v1/auth', userRoute);
// view mentors
app.use('/api/v1/mentors', MentorRoute);
// session
app.use('/api/v1/sessions', sessionRoute);
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
