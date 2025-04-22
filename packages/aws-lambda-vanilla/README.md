# AWS Lambda Vanilla (`aws-lambda-vanilla`)

This package provides a plain AWS Lambda implementation (no specific framework) for the transaction API, using the `core-domain` package for business logic.

## Building

To build this package independently (compile TypeScript and copy SAM template), navigate to this directory (`packages/aws-lambda-vanilla`) and run:

```bash
pnpm build
```

This compiles the TypeScript code to the `dist` directory and copies the `template.yaml` file into `dist` as well.

Alternatively, you can build it from the monorepo root:

```bash
# From /Users/javierbenavides/others/dev/poc/domain-obj-port-adapter-sample
pnpm --filter aws-lambda-vanilla build
```

Or build all packages:

```bash
# From /Users/javierbenavides/others/dev/poc/domain-obj-port-adapter-sample
pnpm build
```

## Testing

Currently, there are no automated tests configured for this package. The `test` script in `package.json` is a placeholder.

```bash
pnpm test
# Output: Error: no test specified
```

You can test the endpoints manually after running the service (see below).

## Running

### Without AWS SAM (using Express Wrapper)

This method uses a simple Express server (`src/server.ts`) to simulate the API Gateway and invoke the Lambda handlers. It's useful for quick local development and testing.

1.  **Build the project:** (If not already done)
    ```bash
    # From /Users/javierbenavides/others/dev/poc/domain-obj-port-adapter-sample
    pnpm build
    ```
2.  **Start the server:**
    ```bash
    # From /Users/javierbenavides/others/dev/poc/domain-obj-port-adapter-sample
    pnpm start:vanilla
    ```
    This will start the server, typically listening on `http://localhost:3001`.

3.  **Development Mode (with auto-reload):**
    ```bash
    # From /Users/javierbenavides/others/dev/poc/domain-obj-port-adapter-sample
    pnpm dev:vanilla
    ```
    This uses `ts-node` to run the server directly from TypeScript source, often with faster restarts on code changes.

### With AWS SAM

This method uses the AWS SAM CLI to simulate the AWS Lambda and API Gateway environment locally based on the `template.yaml` file.

1.  **Prerequisites:** Ensure you have the [AWS SAM CLI installed](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-sam-cli.html) and Docker running.
2.  **Build the project:** (SAM needs the compiled JS files)
    ```bash
    # From /Users/javierbenavides/others/dev/poc/domain-obj-port-adapter-sample
    pnpm build
    ```
3.  **Start the local API:**
    ```bash
    # Navigate to the package directory
    cd packages/aws-lambda-vanilla

    # Start the SAM local API
    sam local start-api -p 3001
    ```
    This command uses the `template.yaml` in the current directory (`packages/aws-lambda-vanilla`) and starts a local API Gateway emulator listening on port 3001.

## CURL Samples

**Note:** Ensure the service is running using one of the methods above before executing these commands. Adjust the port if necessary (default is 3001).

**1. Create Transaction**

```bash
curl -X POST http://localhost:3001/transactions \
-H "Content-Type: application/json" \
-d '{
  "amount": 123.45,
  "currency": "USD",
  "description": "Test transaction via Vanilla"
}'
```

*Expected Response (example):*
```json
{
  "id": "some-uuid-string",
  "amount": 123.45,
  "currency": "USD",
  "description": "Test transaction via Vanilla",
  "processedAt": "2025-04-22T...Z"
}
```

**2. Get Transaction Details**

Replace `{transactionId}` with an actual ID obtained from the create response.

```bash
curl http://localhost:3001/transactions/{transactionId}/details
```

*Expected Response (example):*
```json
{
  "id": "{transactionId}",
  "amount": 123.45,
  "currency": "USD",
  "description": "Test transaction via Vanilla",
  "processedAt": "2025-04-22T...Z"
}
```

**3. Get Non-existent Transaction**

```bash
curl http://localhost:3001/transactions/invalid-id/details
```

*Expected Response (example):*
```json
{
  "message": "Transaction with ID invalid-id not found"
}
```
(Status code should be 404)

**4. Create Transaction with Invalid Data**

```bash
curl -X POST http://localhost:3001/transactions \
-H "Content-Type: application/json" \
-d '{
  "amount": -10,
  "currency": "US",
  "description": ""
}'
```

*Expected Response (example - Zod validation):*
```json
{
  "message": "Invalid request body",
  "details": [
    { "code": "too_small", "minimum": 0, "type": "number", "inclusive": false, "exact": false, "message": "Number must be greater than 0", "path": ["amount"] },
    { "code": "too_small", "minimum": 3, "type": "string", "inclusive": true, "exact": false, "message": "String must contain at least 3 character(s)", "path": ["currency"] },
    { "code": "too_small", "minimum": 1, "type": "string", "inclusive": true, "exact": false, "message": "String must contain at least 1 character(s)", "path": ["description"] }
  ]
}
```
(Status code should be 400)
