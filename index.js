import express from 'express';
import cors from 'cors';
import logger from './logger.js';
import * as dotenv from 'dotenv';
import connectDB from './database/index.js';
import apiRoutes from './controllers/index.js';

dotenv.config();
const app = express();
connectDB();

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => res.send('API'));

apiRoutes.forEach((route) => {
    app.use(route.path, route.api);
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => logger.info(`Server started on port ${PORT}`));