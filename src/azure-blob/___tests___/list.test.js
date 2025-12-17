const request = require('supertest');

describe('GET /files', () => {
  beforeEach(() => {
    // 1. Clear the cache so index.js re-initializes for every test
    jest.resetModules();
  });

  test('should return the list of files', async () => {
    const app = require('../index'); // Require inside the test
    const response = await request(app).get('/files');
    
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  test('should return an empty array if the data file does not exist', async () => {
    // 2. Mock fs before requiring the app so it sees the "false" value
    const fs = require('fs');
    jest.spyOn(fs, 'existsSync').mockReturnValue(false);
    
    const app = require('../index'); 
    const response = await request(app).get('/files');

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual([]); // This should now be empty
  });
});