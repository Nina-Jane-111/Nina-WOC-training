const request = require('supertest');
const fs = require('fs');

// 1. Mock the Azure SDK
jest.mock('@azure/storage-blob', () => {
  const uploadFileMock = jest.fn().mockResolvedValue({ requestId: 'mock-id' });
  
  return {
    StorageSharedKeyCredential: jest.fn(),
    BlobServiceClient: jest.fn().mockImplementation(() => ({
      getContainerClient: jest.fn().mockReturnValue({
        getBlockBlobClient: jest.fn().mockReturnValue({
          uploadFile: uploadFileMock // This must match the name in your index.js
        })
      })
    }))
  };
});

// Mock fs.unlinkSync so it doesn't try to delete a non-existent temp file
jest.mock('fs', () => ({
  ...jest.requireActual('fs'),
  unlinkSync: jest.fn(),
  writeFileSync: jest.fn(),
  readFileSync: jest.fn().mockReturnValue('[]'),
  existsSync: jest.fn().mockReturnValue(true),
}));

const app = require('../index');

describe('POST /upload', () => {
  test('should return 200 and a success message when a file is uploaded', async () => {
    const response = await request(app)
      .post('/upload')
      .field('note', 'My Test File')
      .attach('file', Buffer.from('fake content'), 'test.txt');

if (response.statusCode !== 200) {
  console.log('Error Body:', response.text);
}
    expect(response.statusCode).toBe(200);
    expect(response.text).toMatch(/success/i);
  });

  test('should return 400 if note is missing', async () => {
    const response = await request(app)
      .post('/upload')
      .attach('file', Buffer.from('fake content'), 'test.txt');
    expect(response.statusCode).toBe(400);
    expect(response.text).toBe('File name is required.');
  });
  test('should return 500 if the Azure upload fails', async () => {
    // Force the uploadFile mock to fail just for this test
    const { BlobServiceClient } = require('@azure/storage-blob');
    const mockServiceClient = new BlobServiceClient();
    mockServiceClient.getContainerClient().getBlockBlobClient().uploadFile.mockRejectedValueOnce(new Error('Azure Crash'));

    const response = await request(app)
      .post('/upload')
      .field('note', 'Faulty Upload')
      .attach('file', Buffer.from('content'), 'test.txt');

    expect(response.statusCode).toBe(500);
    expect(response.text).toBe('Failed to upload file.');
  });
});