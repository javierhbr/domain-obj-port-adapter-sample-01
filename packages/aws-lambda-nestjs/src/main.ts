// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { configure as serverlessExpress } from '@vendia/serverless-express';
import { Callback, Context, Handler } from 'aws-lambda';
import { ValidationPipe } from '@nestjs/common'; // Import ValidationPipe

let server: Handler;

// Bootstrap function for Lambda execution
async function bootstrapLambda(): Promise<Handler> {
  const app = await NestFactory.create(AppModule);
  // Add global validation pipe (ensure class-validator decorators work)
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));
  await app.init();

  const expressApp = app.getHttpAdapter().getInstance();
  return serverlessExpress({ app: expressApp });
}

// Bootstrap function for local development/direct execution
async function bootstrapLocal() {
  const app = await NestFactory.create(AppModule);
  // Add global validation pipe (ensure class-validator decorators work)
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`[NestJS] Application is running on: ${await app.getUrl()}`);
}

// Check if running in Lambda environment or locally
// A simple check: if the script is the main module, run locally.
// More robust checks might involve environment variables like AWS_LAMBDA_FUNCTION_NAME.
if (require.main === module) {
  console.log('[NestJS] Running in local mode...');
  bootstrapLocal().catch(err => {
    console.error('[NestJS] Error starting local server:', err);
    process.exit(1);
  });
}

// Lambda handler
export const handler = async (event: any, context: Context, callback: Callback) => {
  server = server ?? (await bootstrapLambda());
  return server(event, context, callback);
};
