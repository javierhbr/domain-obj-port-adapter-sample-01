Okay, here are `curl` examples for testing your locally running services.

**Assumptions:**
*   You have run `pnpm install` and `pnpm build`.
*   You have started the services in separate terminals:
    *   `pnpm start:vanilla` (running on port 3001)
    *   `pnpm start:middy` (running on port 3002)
    *   `pnpm start:nestjs` (running on port 3000 - verify this in the NestJS startup logs or `main.ts`)

---

**1. Create Transaction (POST /transactions)**

*   **Vanilla (Port 3001):**
    ```bash
    curl -X POST http://localhost:3001/transactions \
    -H "Content-Type: application/json" \
    -d '{
      "amount": 123.45,
      "currency": "USD",
      "description": "Test transaction via Vanilla"
    }'
    ```

*   **Middy (Port 3002):**
    ```bash
    curl -X POST http://localhost:3002/transactions \
    -H "Content-Type: application/json" \
    -d '{
      "amount": 50.00,
      "currency": "EUR",
      "description": "Test transaction via Middy"
    }'
    ```

*   **NestJS (Port 3000):**
    ```bash
    curl -X POST http://localhost:3000/transactions \
    -H "Content-Type: application/json" \
    -d '{
      "amount": 99.99,
      "currency": "GBP",
      "description": "Test transaction via NestJS"
    }'
    ```

*   **Functional Fastify (Port 3004):**
    ```bash
    curl -X POST http://localhost:3004/transactions \
    -H "Content-Type: application/json" \
    -d '{
      "amount": 75.25,
      "currency": "CAD",
      "description": "Test transaction via Functional Fastify"
    }'
    ```

**Note:** The response from the POST request should include the `id` of the newly created transaction. You'll need this ID for the next step.

---

**2. Get Transaction Details (GET /transactions/{transactionId}/details)**

Replace `{transactionId}` with an actual ID obtained from a previous POST request.

*   **Vanilla (Port 3001):**
    ```bash
    curl http://localhost:3001/transactions/{transactionId}/details
    ```

*   **Middy (Port 3002):**
    ```bash
    curl http://localhost:3002/transactions/{transactionId}/details
    ```

*   **NestJS (Port 3000):**
    ```bash
    curl http://localhost:3000/transactions/{transactionId}/details
    ```

*   **Functional Fastify (Port 3004):**
    ```bash
    curl http://localhost:3004/transactions/{transactionId}/details
    ```

---

Remember to replace `{transactionId}` in the GET requests with a valid ID returned by one of the POST requests for the corresponding service.