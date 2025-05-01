// src/routes/transactions.js
const { transactionService } = require('../config/dependencies');
const { validate, validateCreateTransaction } = require('../dto/schemas');

// Define our mapper function inline to avoid import issues
const toTransactionDetailsDto = (transaction) => ({
  id: transaction.id,
  amount: transaction.amount,
  currency: transaction.currency,
  description: transaction.description,
  processedAt: transaction.timestamp.toISOString(),
});

/**
 * Registers transaction routes with the Fastify instance
 * @param {FastifyInstance} fastify - Fastify instance
 */
const registerTransactionRoutes = async (fastify) => {
  // POST /transactions - Create a new transaction
  fastify.post('/transactions', {
    schema: {
      body: {
        type: 'object',
        properties: {
          amount: { type: 'number', exclusiveMinimum: 0 },
          currency: { type: 'string', minLength: 3, maxLength: 3 },
          description: { type: 'string', minLength: 1, maxLength: 255 }
        },
        required: ['amount', 'currency', 'description']
      },
      response: {
        201: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            amount: { type: 'number' },
            currency: { type: 'string' },
            description: { type: 'string' },
            processedAt: { type: 'string', format: 'date-time' }
          }
        }
      }
    },
    handler: async (request, reply) => {
      try {
        // Validate input using our custom validator
        const validatedData = validate(validateCreateTransaction, request.body);
        
        // Create transaction using domain service
        const transaction = await transactionService.createTransaction(validatedData);
        
        // Transform domain object to DTO for response
        let responseDto;
        
        // Check if toTransactionDetailsDto is available, otherwise transform manually
        if (typeof toTransactionDetailsDto === 'function') {
          responseDto = toTransactionDetailsDto(transaction);
        } else {
          console.log('[Functional Fastify] Using fallback mapper');
          responseDto = {
            id: transaction.id,
            amount: transaction.amount,
            currency: transaction.currency,
            description: transaction.description,
            processedAt: transaction.timestamp.toISOString(),
          };
        }
        
        return reply.code(201).send(responseDto);
      } catch (error) {
        console.error('[Functional Fastify] Error creating transaction:', error);
        
        if (error.validationErrors) {
          return reply.code(400).send({
            statusCode: 400,
            error: 'Bad Request',
            message: 'Validation error',
            details: error.validationErrors
          });
        }
        
        if (error.message === 'Transaction amount must be positive.') {
          return reply.code(400).send({ 
            statusCode: 400, 
            error: 'Bad Request', 
            message: error.message 
          });
        }
        
        return reply.code(500).send({ 
          statusCode: 500, 
          error: 'Internal Server Error', 
          message: 'Failed to create transaction' 
        });
      }
    }
  });

  // GET /transactions/:transactionId/details - Get transaction details
  fastify.get('/transactions/:transactionId/details', {
    schema: {
      params: {
        type: 'object',
        properties: {
          transactionId: { type: 'string' }
        },
        required: ['transactionId']
      },
      response: {
        200: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            amount: { type: 'number' },
            currency: { type: 'string' },
            description: { type: 'string' },
            processedAt: { type: 'string', format: 'date-time' }
          }
        }
      }
    },
    handler: async (request, reply) => {
      try {
        const { transactionId } = request.params;
        
        // Get transaction details using domain service
        const transaction = await transactionService.getTransactionDetails(transactionId);
        
        if (!transaction) {
          return reply.code(404).send({ 
            statusCode: 404, 
            error: 'Not Found', 
            message: `Transaction with ID ${transactionId} not found` 
          });
        }
        
        // Transform domain object to DTO for response
        let responseDto;
        
        // Check if toTransactionDetailsDto is available, otherwise transform manually
        if (typeof toTransactionDetailsDto === 'function') {
          responseDto = toTransactionDetailsDto(transaction);
        } else {
          console.log('[Functional Fastify] Using fallback mapper');
          responseDto = {
            id: transaction.id,
            amount: transaction.amount,
            currency: transaction.currency,
            description: transaction.description,
            processedAt: transaction.timestamp.toISOString(),
          };
        }
        
        return reply.send(responseDto);
      } catch (error) {
        console.error('[Functional Fastify] Error fetching transaction details:', error);
        return reply.code(500).send({ 
          statusCode: 500, 
          error: 'Internal Server Error', 
          message: 'Failed to fetch transaction details' 
        });
      }
    }
  });
};

module.exports = { registerTransactionRoutes };
