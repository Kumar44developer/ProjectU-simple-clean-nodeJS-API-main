import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from "express-rate-limit";
import compression from "compression";

import mainRoutes from './main.routes.js';
import userRoutes from './user.routes.js';


const app = express();
const port = process.env.PORT || 4000;

app.set('trust proxy', 1);

const rateLimiter = rateLimit({
windowMs: 60 * 1000,
max: 100,
message: {
status: 429,
message: "Too many requests, please try again later."
}
});

app.use(compression());
app.use(express.json());
app.use(helmet());

app.use(cors({
origin: process.env.FRONTEND_URL || "*",
credentials: true
}));

app.get('/', (req, res) => {
res.status(200).send('API is running 🚀');
});

app.use('/v1', rateLimiter);

app.use('/v1', mainRoutes);
app.use('/v1/user', userRoutes);
















