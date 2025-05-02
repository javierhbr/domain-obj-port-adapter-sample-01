// src/server.js
const express = require('express');
const { createTransactionHandler, getTransactionDetailsHandler } = require('./handlers');

// Create Express server
const app = express();
const port = 3005; // Unique port for this service

// Parse JSON requests
app.use(express.json());

/**
 * Adapts an Express request to the format expected by Lambda handlers
 */
const adaptRequest = (req) => ({
  httpMethod: req.method,
  path: req.path,
  headers: req.headers,
  queryStringParameters: req.query,
  pathParameters: req.params,
  body: req.body,
  requestContext: {
    requestId: `local-${Date.now()}`,
  }
});

/**
 * Adapts a Lambda response to Express response
 */
const adaptResponse = (lambdaResult, res) => {
  res.status(lambdaResult.statusCode);
  
  if (lambdaResult.headers) {
    Object.keys(lambdaResult.headers).forEach(key => {
      res.setHeader(key, lambdaResult.headers[key]);
    });
  }
  
  res.send(lambdaResult.body);
};

/**
 * Handle errors from Lambda handlers
 */
const handleError = (error, res) => {
  console.error('[Express Server] Uncaught error:', error);
  
  if (error.statusCode && error.message) {
    res.status(error.statusCode).json({ message: error.message });
  } else {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// POST /transactions
app.post('/transactions', async (req, res) => {
  console.log('[Express Server] Received POST /transactions');
  
  try {
    // Create Lambda event from request
    const event = adaptRequest(req);
    const context = { functionName: 'local-createTransaction' };
    
    // Call Lambda handler
    const result = await createTransactionHandler(event, context);
    
    // Send response
    adaptResponse(result, res);
  } catch (error) {
    handleError(error, res);
  }
});

// GET /transactions/:transactionId/details
app.get('/transactions/:transactionId/details', async (req, res) => {
  console.log(`[Express Server] Received GET /transactions/${req.params.transactionId}/details`);
  
  try {
    // Create Lambda event from request
    const event = adaptRequest(req);
    const context = { functionName: 'local-getTransactionDetails' };
    
    // Call Lambda handler
    const result = await getTransactionDetailsHandler(event, context);
    
    // Send response
    adaptResponse(result, res);
  } catch (error) {
    handleError(error, res);
  }
});

// Start server
if (require.main === module) {
  app.listen(port, () => {
    console.log(`[Express Server] Functional Middy server running at http://localhost:${port}`);
  });
}

module.exports = { app, port };
