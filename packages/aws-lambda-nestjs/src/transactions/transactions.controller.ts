// src/transactions/transactions.controller.ts
import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Inject,
  HttpCode,
  HttpStatus,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
  ParseUUIDPipe,
  ValidationPipe, // Import ValidationPipe if using it per-route
} from '@nestjs/common';
import { TransactionService } from 'core-domain';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { TransactionDetailsDto } from './dto/transaction-details.dto';
import { TRANSACTION_SERVICE } from '@config/dependencies.provider';

@Controller('transactions')
export class TransactionsController {
  constructor(
    @Inject(TRANSACTION_SERVICE) private readonly transactionService: TransactionService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createTransaction(
    // Apply ValidationPipe here if not applied globally
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true })) createTransactionDto: CreateTransactionDto,
  ): Promise<TransactionDetailsDto> {
    console.log('[NestJS] Received DTO for createTransaction:', createTransactionDto);
    try {
      const newTransaction = await this.transactionService.createTransaction(
        createTransactionDto,
      );

      // Map domain object to DTO
      const responseDto: TransactionDetailsDto = {
        id: newTransaction.id,
        amount: newTransaction.amount,
        currency: newTransaction.currency,
        description: newTransaction.description,
        processedAt: newTransaction.timestamp.toISOString(),
      };
      return responseDto;
    } catch (error: any) {
      console.error('[NestJS] Error creating transaction:', error);
       if (error.message === 'Transaction amount must be positive.') {
        throw new BadRequestException(error.message);
      }
      throw new InternalServerErrorException('Failed to create transaction');
    }
  }

  @Get(':transactionId/details')
  async getTransactionDetails(
    @Param('transactionId', ParseUUIDPipe) transactionId: string,
  ): Promise<TransactionDetailsDto> {
     console.log(`[NestJS] Received request for getTransactionDetails ID: ${transactionId}`);
    try {
      const transaction = await this.transactionService.getTransactionDetails(transactionId);

      if (!transaction) {
        throw new NotFoundException(`Transaction with ID ${transactionId} not found`);
      }

      // Map domain object to DTO
      const responseDto: TransactionDetailsDto = {
        id: transaction.id,
        amount: transaction.amount,
        currency: transaction.currency,
        description: transaction.description,
        processedAt: transaction.timestamp.toISOString(),
      };
      return responseDto;
    } catch (error) {
       console.error(`[NestJS] Error fetching transaction ${transactionId}:`, error);
       if (error instanceof NotFoundException || error instanceof BadRequestException) {
           throw error;
       }
      throw new InternalServerErrorException('Failed to fetch transaction details');
    }
  }
}
