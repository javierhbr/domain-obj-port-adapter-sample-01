// src/server.js
const Fastify = require('fastify');
const { registerTransactionRoutes } = require('./routes/transactions');

// Create Fastify instance
const fastify = Fastify({
  logger: {
    level: 'info',
    transport: {
      target: 'pino-pretty'
    }
  }
});

// Register routes
const registerRoutes = async () => {
  await registerTransactionRoutes(fastify);
};

// Register error handler
fastify.setErrorHandler((error, request, reply) => {
  console.error('[Functional Fastify] Error:', error);
  
  if (error.validation) {
    return reply.code(400).send({
      statusCode: 400,
      error: 'Bad Request',
      message: 'Validation error',
      details: error.validation
    });
  }
  
  // Handle custom error with status code
  if (error.statusCode) {
    return reply.code(error.statusCode).send({
      statusCode: error.statusCode,
      error: error.name || 'Error',
      message: error.message
    });
  }
  
  // Default to 500 error
  reply.code(500).send({
    statusCode: 500,
    error: 'Internal Server Error',
    message: 'An internal error occurred'
  });
});

// Start the server
const start = async () => {
  try {
    console.log('[Functional Fastify] Starting server...');
    await registerRoutes();
    console.log('[Functional Fastify] Routes registered');
    await fastify.listen({ port: 3004, host: '0.0.0.0' });
    console.log(`[Functional Fastify] Server is running on http://localhost:3004`);
  } catch (err) {
    console.error('[Functional Fastify] Server startup error:', err);
    process.exit(1);
  }
};

// Start server if running directly
if (require.main === module) {
  start();
}

module.exports = { fastify, start };
