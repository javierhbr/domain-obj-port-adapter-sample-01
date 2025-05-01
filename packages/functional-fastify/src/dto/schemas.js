// src/dto/schemas.js
const Ajv = require('ajv');

const ajv = new Ajv({
  allErrors: true,
  removeAdditional: true,
  useDefaults: true,
  coerceTypes: true,
});

// Schema for creating a transaction
const createTransactionSchema = {
  type: 'object',
  properties: {
    amount: { type: 'number', exclusiveMinimum: 0 },
    currency: { type: 'string', minLength: 3, maxLength: 3 },
    description: { type: 'string', minLength: 1, maxLength: 255 },
  },
  required: ['amount', 'currency', 'description'],
  additionalProperties: false,
};

// Compiled validation functions
const validateCreateTransaction = ajv.compile(createTransactionSchema);

// Helper function to validate data against a schema
const validate = (validationFn, data) => {
  const valid = validationFn(data);
  if (!valid) {
    const errors = validationFn.errors || [];
    const error = new Error('Validation error');
    error.statusCode = 400;
    error.validationErrors = errors;
    throw error;
  }
  return data;
};

module.exports = { createTransactionSchema, validateCreateTransaction, validate };
