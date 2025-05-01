# Domain-Centric Architecture with Multiple Lambda Implementations

This monorepo demonstrates a domain-centric (Ports and Adapters) architecture using TypeScript, showcasing how a core domain logic package can be consumed by different AWS Lambda implementations (Vanilla, Middy, NestJS).

## Architecture Overview

The goal is to isolate the core business logic from the delivery mechanism (AWS Lambda and specific frameworks).

1.  **`core-domain`**: This is the heart of the application.
    *   Defines domain objects (e.g., `Transaction`).
    *   Defines interfaces (`ports`) for external dependencies (e.g., `TransactionRepository`).
    *   Contains the core business logic (`TransactionService`) which depends only on the ports, not on concrete implementations.

2.  **Lambda and API Packages**: These are the delivery mechanisms (the adapters).
    *   Each package implements the HTTP API endpoints.
    *   They provide concrete implementations (`adapters`) for the ports defined in `core-domain` (e.g., `InMemoryTransactionRepository`).
    *   They define their own Data Transfer Objects (DTOs) for request/response validation and mapping.
    *   They inject the adapter implementation into the `TransactionService` from `core-domain` to execute the business logic.
    *   Different frameworks and programming paradigms are used:
        *   `aws-lambda-vanilla`: No framework, manual DI, Zod for validation.
        *   `aws-lambda-middy`: Uses Middy middleware for request parsing, validation (Zod via `@middy/validator`), and error handling.
        *   `aws-lambda-nestjs`: Uses the NestJS framework for structure, DI, validation (`class-validator`), and request handling.
        *   `functional-fastify`: Uses JavaScript functional programming with Fastify, Ajv for validation, and pure function composition.

## Monorepo Setup (pnpm Workspaces)

This repository uses [pnpm workspaces](https://pnpm.io/workspaces) to manage the multiple packages.

### Prerequisites

*   [Node.js](https://nodejs.org/) (v18 or later recommended)
*   [pnpm](https://pnpm.io/installation)
*   (Optional) [AWS SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-sam-cli.html) and [Docker](https://www.docker.com/get-started/) for running with SAM.

### Installation

Clone the repository and install all dependencies for all packages from the root directory:

```bash
cd domain-obj-port-adapter-sample
pnpm install
```

### Building

To compile TypeScript code for all packages, run from the root directory:

```bash
pnpm build
```

This will run the `build` script defined in each package's `package.json`.

## Running the Services Locally

You can run each implementation locally using either AWS SAM or a direct Node.js execution method (using Express wrappers for Vanilla/Middy, NestJS CLI/Node for NestJS, and Node.js for Functional-Fastify).

**Important:** Run each service in a separate terminal.

### 1. Vanilla Lambda (`aws-lambda-vanilla`)

*   **Without SAM (Express):**
    ```bash
    # From root directory
    pnpm start:vanilla
    ```
    Runs on `http://localhost:3001`.

*   **With SAM:**
    ```bash
    # From root directory
    cd packages/aws-lambda-vanilla
    sam local start-api -p 3001
    ```
    Runs on `http://localhost:3001`.

### 2. Middy Lambda (`aws-lambda-middy`)

*   **Without SAM (Express):**
    ```bash
    # From root directory
    pnpm start:middy
    ```
    Runs on `http://localhost:3002`.

*   **With SAM:**
    ```bash
    # From root directory
    cd packages/aws-lambda-middy
    sam local start-api -p 3002
    ```
    Runs on `http://localhost:3002`.

### 3. NestJS Lambda (`aws-lambda-nestjs`)

*   **Without SAM (Node/NestJS CLI):**
    *   Development (watch mode): `pnpm dev:nestjs` (Runs on `http://localhost:3000`)
    *   Production build: `pnpm start:nestjs` (Runs on `http://localhost:3000` - verify port in logs)

*   **With SAM:**
    ```bash
    # From root directory
    cd packages/aws-lambda-nestjs
    sam local start-api -p 3003
    ```
    Runs on `http://localhost:3003`.
    
### 4. Functional Fastify (`functional-fastify`)

*   **Without SAM (Node.js):**
    *   Standard mode: `pnpm start:fastify` (Runs on `http://localhost:3004`)
    *   Development (watch mode): `pnpm dev:fastify` (Runs on `http://localhost:3004`)

*   **With SAM:**
    ```bash
    # From root directory
    pnpm build:fastify
    cd packages/functional-fastify
    sam local start-api -p 3004
    ```
    Runs on `http://localhost:3004`.

## API Endpoints

All four implementations expose the same two endpoints:

1.  **Create Transaction:**
    *   `POST /transactions`
    *   **Request Body:**
        ```json
        {
          "amount": number,     // Must be positive
          "currency": string,   // Must be 3 characters (e.g., "USD")
          "description": string // Must not be empty
        }
        ```
    *   **Success Response (201 Created):**
        ```json
        {
          "id": string,         // Generated transaction ID
          "amount": number,
          "currency": string,
          "description": string,
          "processedAt": string // ISO 8601 timestamp
        }
        ```
    *   **Error Responses:** 400 (Bad Request on validation failure), 500 (Internal Server Error)

2.  **Get Transaction Details:**
    *   `GET /transactions/{transactionId}/details`
    *   **URL Parameter:** `transactionId` (string, typically UUID)
    *   **Success Response (200 OK):**
        ```json
        {
          "id": string,
          "amount": number,
          "currency": string,
          "description": string,
          "processedAt": string // ISO 8601 timestamp
        }
        ```
    *   **Error Responses:** 404 (Not Found if ID doesn't exist), 500 (Internal Server Error)

## Testing the Endpoints

Refer to the `README.md` file within each package directory for specific `curl` examples tailored to that implementation's default port.

You can also use the `requests.http` file in the root directory with the [VS Code REST Client extension](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) for convenient testing.

## Programming Paradigms Comparison

This monorepo showcases different programming approaches while working with the same core domain:

1. **Object-Oriented (Class-Based)**
   * `aws-lambda-vanilla`, `aws-lambda-middy`, and `aws-lambda-nestjs` use TypeScript classes
   * Dependency injection through constructors
   * Interface implementation through class implementation

2. **Functional Programming**
   * `functional-fastify` uses JavaScript functions and pure function composition
   * Avoids classes and mutations where possible
   * Dependency injection through function parameters and closures
   * Promotes composition over inheritance

Each approach demonstrates a valid way to fulfill the same port contracts defined in the core domain, showing the flexibility of the ports and adapters architecture.
