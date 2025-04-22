// src/dto/CreateTransaction.dto.ts
import { z } from 'zod';

// Define the Zod schema for input validation (directly for the body)
export const CreateTransactionSchema = z.object({
  amount: z.number().positive("Amount must be positive"),
  currency: z.string().length(3, "Currency must be 3 characters"), // e.g., 'USD'
  description: z.string().min(1, "Description cannot be empty").max(255, "Description too long"),
});

// Define the TypeScript type from the schema
export type CreateTransactionDto = z.infer<typeof CreateTransactionSchema>;
