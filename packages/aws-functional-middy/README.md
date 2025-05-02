# AWS Functional Middy Lambda

This package provides an AWS Lambda implementation using JavaScript in a functional programming style with the Middy middleware framework. Unlike other AWS Lambda implementations in this monorepo that use classes and TypeScript, this package uses pure JavaScript functions and functional composition.

## Architecture

- Uses functional adapters to fulfill the core-domain port contracts
- Implements JSON schema validation with Middy validator
- Uses pure dependency injection to wire dependencies into domain services
- Follows functional programming principles

## API Endpoints

- `POST /transactions` - Create a new transaction
- `GET /transactions/{transactionId}/details` - Get details of a transaction

## Building

To build this package:

```bash
# From this directory
pnpm build

# Or from the monorepo root
pnpm --filter aws-functional-middy build
```

This builds the JavaScript code, bundles it with esbuild, and copies the template.yaml file to the dist directory for AWS SAM deployment.

## Running Locally

### With Node.js directly

```bash
# From this directory
pnpm start

# With auto-reload during development
pnpm dev

# Or from the monorepo root
pnpm start:functional-middy
pnpm dev:functional-middy
```

This starts an Express server on port 3005 that wraps the Lambda handlers.

### With AWS SAM

```bash
# Build first
pnpm build

# Start the local API
cd dist
sam local start-api -p 3005
```

This runs the Lambda functions using AWS SAM on port 3005.

## Testing with cURL

### Create a transaction

```bash
curl -X POST http://localhost:3005/transactions \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 99.99,
    "currency": "USD",
    "description": "Test transaction with Functional Middy"
  }'
```

### Get transaction details

```bash
# Replace {transactionId} with an actual ID from the create response
curl http://localhost:3005/transactions/{transactionId}/details
```

## Implementation Details

### Functional Programming Approach

- Uses pure functions instead of classes
- Uses function composition for middleware composition
- Avoids mutable state where possible
- Uses dependency injection through function parameters and closures

### Middy Middleware

The package uses Middy for middleware:

- `httpJsonBodyParser` - Parses JSON request bodies
- `validator` - Validates requests against JSON schema
- `httpErrorHandler` - Converts errors to HTTP responses

### Ports and Adapters

The package follows the ports and adapters architecture pattern:

- Implements the TransactionRepository port from core-domain as a functional adapter
- Uses the core domain's TransactionService for business logic
- Converts between domain models and DTOs using pure functions
