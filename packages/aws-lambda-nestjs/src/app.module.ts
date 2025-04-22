// src/app.module.ts
import { Module, ValidationPipe } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { TransactionsModule } from './transactions/transactions.module';

@Module({
  imports: [TransactionsModule],
  controllers: [],
  providers: [
    // Globally enable validation pipe using class-validator
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true, // Strip properties not defined in DTO
        forbidNonWhitelisted: true, // Throw error if extra properties are present
        transform: true, // Automatically transform payloads to DTO instances
      }),
    },
  ],
})
export class AppModule {}
