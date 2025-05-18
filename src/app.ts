import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import router from './presentation/routes/index';
import { config } from './config/config';

const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.use(express.static(path.join(process.cwd(), 'public')));

mongoose
  .connect(config.databaseURL || '')
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  });

app.use('/api', router);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is running' });
});

app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found',
    error: `Cannot ${req.method} ${req.originalUrl}`
  });
});

app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'production' ? 'Something went wrong' : err.message
  });
});

const PORT = config.port || 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app; 