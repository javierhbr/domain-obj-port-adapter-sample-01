# Core Domain Package (`core-domain`)

This package contains the central domain logic, interfaces (ports), and domain objects for the transaction system.

## Building

To build this package independently (compile TypeScript to JavaScript), navigate to this directory (`packages/core-domain`) and run:

```bash
pnpm build
```

Alternatively, you can build it from the monorepo root:

```bash
# From /Users/javierbenavides/others/dev/poc/domain-obj-port-adapter-sample
pnpm --filter core-domain build
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

## Running

This is a library package and is not meant to be run directly. It provides exports (interfaces, classes) to be used by other packages (like the Lambda implementations).

## CURL Samples

Not applicable, as this package does not expose an HTTP interface.
