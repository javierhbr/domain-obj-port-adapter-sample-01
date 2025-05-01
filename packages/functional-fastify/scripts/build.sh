#!/bin/bash
# Build script that builds core-domain first so our functional-fastify package can use it
cd "$(dirname "$0")/.." || exit
echo "Building core-domain first..."
pnpm --filter core-domain build
echo "Building functional-fastify..."
cd packages/functional-fastify
pnpm build
echo "Done!"
