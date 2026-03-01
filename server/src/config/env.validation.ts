import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('3000'),
  DATABASE_URL: z.string().url('DATABASE_URL must be a valid connection string'),
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters'),
  CORS_ORIGIN: z.string().default('http://localhost:5173'),
});

export const validateEnv = () => {
  const result = envSchema.safeParse(process.env);
  if (!result.success) {
    console.error('Environment validation failed:');
    console.error(result.error.flatten().fieldErrors);
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
    console.warn('Running with missing env vars in development mode');
  }
  return result.data;
};
