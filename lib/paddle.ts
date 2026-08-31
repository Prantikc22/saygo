import { Environment, LogLevel, Paddle, type PaddleOptions } from '@paddle/paddle-node-sdk';

export function getPaddle() {
  const key = process.env.PADDLE_API_KEY;
  if (!key) throw new Error('PADDLE_API_KEY is not configured');
  const options: PaddleOptions = {
    environment: process.env.NEXT_PUBLIC_PADDLE_ENV === 'production' ? Environment.production : Environment.sandbox,
    logLevel: LogLevel.error,
  };
  return new Paddle(key, options);
}
