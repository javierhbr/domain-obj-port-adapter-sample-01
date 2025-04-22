// src/server.ts
import express, { Request, Response } from 'express';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { createTransactionHandler, getTransactionDetailsHandler } from './handlers'; // Import the middy-wrapped handlers

const app = express();
const port = 3002;

app.use(express.json());

// Helper to adapt Express req to APIGatewayProxyEvent
function adaptRequest(req: Request): Partial<APIGatewayProxyEvent> {
  return {
    httpMethod: req.method,
    path: req.path,
    headers: req.headers as { [name: string]: string },
    queryStringParameters: req.query as { [name: string]: string },
    pathParameters: req.params as { [name: string]: string },
    // Pass the parsed body directly for Middy handler simulation
    // The validator middleware expects the event structure *before* parsing,
    // but for local Express testing, we simulate the state *after* parsing.
    body: req.body ?? null, // Pass the object directly
    requestContext: { // Add minimal requestContext if needed by handlers/middleware
        requestId: `local-${Date.now()}`,
        // ... other context fields
    } as any,
  };
}

// Helper to adapt APIGatewayProxyResult to Express res
function adaptResponse(result: APIGatewayProxyResult, res: Response) {
  res.status(result.statusCode);
  if (result.headers) {
    Object.keys(result.headers).forEach(key => {
      res.setHeader(key, result.headers![key].toString());
    });
  }
  // Middy's httpErrorHandler stringifies errors, so send directly
  res.send(result.body);
}

// POST /transactions
app.post('/transactions', async (req: Request, res: Response) => {
  console.log(`[Express Middy] Received POST /transactions`);
  // Adapt the request, including the already parsed body
  const event = adaptRequest(req);

  // Create a minimal context object
  const context = { functionName: 'createTransactionHandler-local' } as any;

  try {
    // Call the Middy handler with event and context.
    // We cast event to `any` because the raw APIGatewayProxyEvent expects a string body,
    // but our adapted event has an object body to simulate http-json-body-parser.
    // The validator middleware inside the handler needs the specific structure.
    const result = await createTransactionHandler(event as any, context);
    adaptResponse(result, res);
  } catch (error) {
    console.error('[Express Middy] Uncaught Error:', error);
    // Attempt to mimic Middy's httpErrorHandler format if possible
    if (error && typeof error === 'object' && 'statusCode' in error && 'message' in error) {
        res.status(error.statusCode as number).json({ message: error.message });
    } else {
        res.status(500).json({ message: 'Internal Server Error' });
    }
  }
});

// GET /transactions/:transactionId/details
app.get('/transactions/:transactionId/details', async (req: Request, res: Response) => {
  console.log(`[Express Middy] Received GET /transactions/${req.params.transactionId}/details`);
  const event = adaptRequest(req);
  const context = { functionName: 'getTransactionDetailsHandler-local' } as any;

  try {
    // Call handler with event and context
    const result = await getTransactionDetailsHandler(event as any, context);
    adaptResponse(result, res);
  } catch (error) {
     console.error('[Express Middy] Uncaught Error:', error);
     if (error && typeof error === 'object' && 'statusCode' in error && 'message' in error) {
        res.status(error.statusCode as number).json({ message: error.message });
    } else {
        res.status(500).json({ message: 'Internal Server Error' });
    }
  }
});

app.listen(port, () => {
  console.log(`[Express Middy] Server listening on port ${port}`);
});
