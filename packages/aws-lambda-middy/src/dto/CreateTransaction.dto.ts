// src/dto/CreateTransaction.dto.ts
import { z } from 'zod';

// Define the Zod schema for input validation
export const CreateTransactionSchema = z.object({
  body: z.object({
      amount: z.number().positive(),
      currency: z.string().length(3), // e.g., 'USD'
      description: z.string().min(1).max(255),
  })
});

// Define the TypeScript type from the schema (specifically the body part)
export type CreateTransactionDto = z.infer<typeof CreateTransactionSchema>['body'];
