import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './api/index.js';
import { errorMiddleware } from './middleware/errorMiddleware.js';

dotenv.config();

const app = express();

app.use(
    cors({
        origin: ["http://localhost:3000"],
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true,
    })
);
app.use(express.json());

app.use('/api', routes);
app.use(errorMiddleware);

export default app;
