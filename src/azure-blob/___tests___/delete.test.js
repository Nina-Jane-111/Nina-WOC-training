const request = require('supertest');
const fs = require('fs');

// 1. Mock the Azure SDK specifically for Delete
jest.mock('@azure/storage-blob', () => {
  const deleteMock = jest.fn().mockResolvedValue({ requestId: 'mock-delete-id' });
  
  return {
    StorageSharedKeyCredential: jest.fn(),
    BlobServiceClient: jest.fn().mockImplementation(() => ({
      getContainerClient: jest.fn().mockReturnValue({
        getBlockBlobClient: jest.fn().mockReturnValue({
          delete: deleteMock // Matches your index.js: await blockBlobClient.delete()
        })
      })
    }))
  };
});

// Mock fs to prevent actual file system changes during testing
jest.mock('fs', () => ({
  ...jest.requireActual('fs'),
  writeFileSync: jest.fn(),
  readFileSync: jest.fn().mockReturnValue('[]'),
  existsSync: jest.fn().mockReturnValue(true),
}));

const app = require('../index');

describe('DELETE /files/:key', () => {
  test('should return 200 and success message when file is deleted', async () => {
    const fileKey = 'test-blob-uuid-123';
    
    // 2. Execute the DELETE request
    const response = await request(app).delete(`/files/${fileKey}`);

    // 3. Assertions
    expect(response.statusCode).toBe(200);
    expect(response.text).toBe('File deleted successfully.');
  });

  test('should return 500 if the Azure service fails to delete', async () => {
    // We can force the mock to fail for this specific test
    const { BlobServiceClient } = require('@azure/storage-blob');
    BlobServiceClient().getContainerClient().getBlockBlobClient().delete.mockRejectedValueOnce(new Error('Azure Error'));

    const response = await request(app).delete('/files/bad-key');

    expect(response.statusCode).toBe(500);
    expect(response.text).toBe('Failed to delete file.');
  });
});