const request = require('supertest');
const app = require('../index');

describe('GET /files', () => {
  test('should return the list of files', async () => {
    const response = await request(app).get('/files');
    
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
  
  test('should return an empty array if the data file does not exist', async () => {
    const fs = require('fs');
    // Mocking specifically for this test
    jest.spyOn(fs, 'existsSync').mockReturnValueOnce(false);
    
    const response = await request(app).get('/files');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual([]);
  });
});