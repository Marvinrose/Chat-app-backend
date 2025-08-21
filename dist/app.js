import express from 'express';
import cors from 'cors';
import { json } from 'body-parser';
import authRoutes from './routes/authRoutes.js';
const app = express();
app.use(cors());
app.use(json());
app.use('/api/auth', authRoutes);
export default app;
//# sourceMappingURL=app.js.map