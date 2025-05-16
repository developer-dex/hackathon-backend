import express, { Express } from 'express';
import cors from 'cors';
import todoRoutes from '../presentation/routes/todoRoutes';

const createApp = (): Express => {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Routes
  app.use('/api/todos', todoRoutes);

  // Health check
  app.get('/health', (req, res) => {
    res.status(200).json({ status: 'UP' });
  });

  return app;
};

export default createApp; 