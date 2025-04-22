// src/dto/CreateTransaction.dto.ts
import { z } from 'zod';

export const CreateTransactionSchema = z.object({
  amount: z.number().positive(),
  currency: z.string().length(3), // e.g., 'USD'
  description: z.string().min(1).max(255),
});

export type CreateTransactionDto = z.infer<typeof CreateTransactionSchema>;
