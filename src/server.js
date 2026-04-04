import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from "express-rate-limit";
import compression from "compression";

import mainRoutes from './main.routes.js';
import userRoutes from './user.routes.js';


const app = express();
const port = process.env.PORT || 4000;




























