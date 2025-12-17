const { describe, test, expect, beforeEach, afterEach } = require('@jest/globals');
const { initializeApp } = require('../index'); // Adjust to your actual init function

describe('Security: Secret Masking', () => {
  let consoleSpy;

  beforeEach(() => {
    // Intercept console.log before each test
    consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    // Restore the real console.log after each test
    consoleSpy.mockRestore();
  });

  test('should not log sensitive Azure keys during startup', () => {
    // Setup a dummy secret
    const secretKey = "super-secret-azure-key-123";
    process.env.AZURE_STORAGE_KEY = secretKey;

// By requiring the file, the code inside index.js runs
    require('../index');
    
    // Check every call made to console.log
    consoleSpy.mock.calls.forEach(call => {
      const logOutput = call.join(' ');
      // Verify the secret is NOT in the log
      expect(logOutput).not.toMatch(secretKey);
    });
  });
});