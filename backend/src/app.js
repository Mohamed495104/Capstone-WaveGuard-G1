import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './api/index.js';
import { errorMiddleware } from './middleware/errorMiddleware.js';

dotenv.config();

const app = express();

<<<<<<< HEAD
app.use(
    cors({
        origin: ["http://localhost:3000"],
=======
// Only allow trusted frontend origins for CORS
app.use(
    cors({
        origin: ["http://localhost:3000", process.env.FRONTEND_URL].filter(Boolean),
>>>>>>> main
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true,
    })
);
app.use(express.json());

app.use('/api', routes);
app.use(errorMiddleware);

<<<<<<< HEAD
export default app;
=======
export default app;
>>>>>>> main
