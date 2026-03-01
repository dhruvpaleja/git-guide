import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';

import { config } from './config/index.js';
import { errorHandler, notFound } from './middleware/error.js';
import routes from './routes/index.js';

const app = express();

// ---------------------------------------------------------------------------
// Middleware
// ---------------------------------------------------------------------------
app.use(helmet());
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) {
        callback(null, true);
        return;
      }

      const isConfigured = config.cors.allowedOrigins.includes(origin);
      const isLocalDev = /^https?:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin) && !config.isProduction;

      if (isConfigured || isLocalDev) {
        callback(null, true);
        return;
      }

      callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (!config.isProduction) {
  app.use(morgan('dev'));
}

// ---------------------------------------------------------------------------
// Routes
// ---------------------------------------------------------------------------
app.use(config.api.prefix, routes);
app.use('/api', routes);

// ---------------------------------------------------------------------------
// Error handling
// ---------------------------------------------------------------------------
app.use(notFound);
app.use(errorHandler);

// ---------------------------------------------------------------------------
// Start
// ---------------------------------------------------------------------------
app.listen(config.port, () => {
  if (config.nodeEnv !== 'production') {
    console.warn(`Server running on port ${config.port} [${config.nodeEnv}]`);
  }
});

export default app;
