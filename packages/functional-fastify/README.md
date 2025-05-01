# Functional Fastify Package

This package implements a functional programming approach with Fastify to expose the core domain logic through a RESTful API. Unlike other packages in this monorepo that use classes, this package uses pure JavaScript functions and functional composition.

## Architecture

- Uses functional adapters to fulfill the core-domain port contracts
- Implements JSON schema validation with Ajv
- Uses pure dependency injection to wire dependencies into domain services
- Follows functional programming principles

## API Endpoints

- `POST /transactions` - Create a new transaction
- `GET /transactions/{transactionId}/details` - Get details of a transaction

## Running Locally

### With Node.js directly

```bash
# From the functional-fastify package directory
pnpm start
# or with auto-reload
pnpm dev
```

### With AWS SAM

```bash
pnpm build
cd dist && sam local start-api -p 3004 --warm-containers EAGER
```

## Testing with CURL

Create a transaction:
```bash
curl -X POST http://localhost:3004/transactions \
  -H "Content-Type: application/json" \
  -d '{"amount": 100, "currency": "USD", "description": "Test transaction"}'
```

Get transaction details:
```bash
curl http://localhost:3004/transactions/{id}/details
```
