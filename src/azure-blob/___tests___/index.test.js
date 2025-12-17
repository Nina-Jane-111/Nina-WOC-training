const { test, expect } = require('@jest/globals');

const dotenv = require('dotenv');
dotenv.config();

test('Azure Storage Account Name should be defined', () => {
  expect(process.env.AZURE_STORAGE_ACCOUNT_NAME).toBeDefined();
});

test('Azure Container Name should be defined', () => {
  expect(process.env.AZURE_CONTAINER_NAME).toBeDefined();
});