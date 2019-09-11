import express from 'express';
import bodyParse from 'body-parser';
import dotenv from 'dotenv';
import * as HttpStatus from 'http-status-codes';
import Route from './routes/route';


const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger.json');

dotenv.config();

const app = express();
app.use(bodyParse.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


app.use('/api/v2', Route);


app.use('/', (req, res) => {
  res.status(HttpStatus.NOT_FOUND).send({
    status: HttpStatus.NOT_FOUND,
    error: 'Incorrect route',
  });
});

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Listening on port ${port}...`));
export default app;
