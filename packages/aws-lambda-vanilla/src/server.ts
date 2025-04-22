// src/server.ts
import express, { Request, Response } from 'express';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { createTransactionHandler, getTransactionDetailsHandler } from './handlers';

const app = express();
const port = 3001;

app.use(express.json());

// Helper to adapt Express req to APIGatewayProxyEvent
function adaptRequest(req: Request): Partial<APIGatewayProxyEvent> {
  return {
    httpMethod: req.method,
    path: req.path,
    headers: req.headers as { [name: string]: string },
    queryStringParameters: req.query as { [name: string]: string },
    pathParameters: req.params as { [name: string]: string },
    body: req.body ? JSON.stringify(req.body) : null,
    // Add other fields if needed by handlers (e.g., requestContext)
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
  res.send(result.body);
}

// POST /transactions
app.post('/transactions', async (req: Request, res: Response) => {
  console.log(`[Express Vanilla] Received POST /transactions`);
  const event = adaptRequest(req) as APIGatewayProxyEvent;
  try {
    const result = await createTransactionHandler(event);
    adaptResponse(result, res);
  } catch (error) {
    console.error('[Express Vanilla] Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// GET /transactions/:transactionId/details
app.get('/transactions/:transactionId/details', async (req: Request, res: Response) => {
  console.log(`[Express Vanilla] Received GET /transactions/${req.params.transactionId}/details`);
  const event = adaptRequest(req) as APIGatewayProxyEvent;
  try {
    const result = await getTransactionDetailsHandler(event);
    adaptResponse(result, res);
  } catch (error) {
    console.error('[Express Vanilla] Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`[Express Vanilla] Server listening on port ${port}`);
});
