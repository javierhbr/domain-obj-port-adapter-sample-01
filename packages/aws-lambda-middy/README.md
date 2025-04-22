# AWS Lambda with Middy (`aws-lambda-middy`)

This package provides an AWS Lambda implementation using the Middy middleware framework for the transaction API. It utilizes the `core-domain` package for business logic.

## Building

To build this package independently (compile TypeScript and copy SAM template), navigate to this directory (`packages/aws-lambda-middy`) and run:

```bash
pnpm build
```

This compiles the TypeScript code to the `dist` directory and copies the `template.yaml` file into `dist` as well.

Alternatively, you can build it from the monorepo root:

```bash
# From /Users/javierbenavides/others/dev/poc/domain-obj-port-adapter-sample
pnpm --filter aws-lambda-middy build
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

This method uses a simple Express server (`src/server.ts`) to simulate the API Gateway and invoke the Middy-wrapped Lambda handlers. It's useful for quick local development and testing.

1.  **Build the project:** (If not already done)
    ```bash
    # From /Users/javierbenavides/others/dev/poc/domain-obj-port-adapter-sample
    pnpm build
    ```
2.  **Start the server:**
    ```bash
    # From /Users/javierbenavides/others/dev/poc/domain-obj-port-adapter-sample
    pnpm start:middy
    ```
    This will start the server, typically listening on `http://localhost:3002`.

3.  **Development Mode (with auto-reload):**
    ```bash
    # From /Users/javierbenavides/others/dev/poc/domain-obj-port-adapter-sample
    pnpm dev:middy
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
    cd packages/aws-lambda-middy

    # Start the SAM local API
    sam local start-api -p 3002
    ```
    This command uses the `template.yaml` in the current directory (`packages/aws-lambda-middy`) and starts a local API Gateway emulator listening on port 3002.

## CURL Samples

**Note:** Ensure the service is running using one of the methods above before executing these commands. Adjust the port if necessary (default is 3002).

**1. Create Transaction**

```bash
curl -X POST http://localhost:3002/transactions \
-H "Content-Type: application/json" \
-d '{
  "amount": 50.00,
  "currency": "EUR",
  "description": "Test transaction via Middy"
}'
```

*Expected Response (example):*
```json
{
  "id": "some-uuid-string",
  "amount": 50.00,
  "currency": "EUR",
  "description": "Test transaction via Middy",
  "processedAt": "2025-04-22T...Z"
}
```

**2. Get Transaction Details**

Replace `{transactionId}` with an actual ID obtained from the create response.

```bash
curl http://localhost:3002/transactions/{transactionId}/details
```

*Expected Response (example):*
```json
{
  "id": "{transactionId}",
  "amount": 50.00,
  "currency": "EUR",
  "description": "Test transaction via Middy",
  "processedAt": "2025-04-22T...Z"
}
```

**3. Get Non-existent Transaction**

```bash
curl -v http://localhost:3002/transactions/invalid-id/details
```

*Expected Response (example):*
```json
{
  "message": "Transaction with ID invalid-id not found"
}
```
(Status code should be 404 - check with `-v` flag in curl)

**4. Create Transaction with Invalid Data**

```bash
curl -v -X POST http://localhost:3002/transactions \
-H "Content-Type: application/json" \
-d '{
  "amount": -10,
  "currency": "EU",
  "description": ""
}'
```

*Expected Response (example - Middy validator):*
```json
{
  "message": "Event object failed validation",
  "details": [
    { "instancePath": "/body/amount", "schemaPath": "#/properties/body/properties/amount/exclusiveMinimum", "keyword": "exclusiveMinimum", "params": { "comparison": ">", "limit": 0 }, "message": "must be > 0" },
    { "instancePath": "/body/currency", "schemaPath": "#/properties/body/properties/currency/minLength", "keyword": "minLength", "params": { "limit": 3 }, "message": "must NOT have fewer than 3 characters" },
    { "instancePath": "/body/description", "schemaPath": "#/properties/body/properties/description/minLength", "keyword": "minLength", "params": { "limit": 1 }, "message": "must NOT have fewer than 1 characters" }
  ]
}
```
(Status code should be 400 - check with `-v` flag in curl)
