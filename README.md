# MongoDB RAG Example

This project demonstrates how to build a Retrieval-Augmented Generation (RAG) system using MongoDB's vector search capabilities.

## Setup

Before testing the server endpoints, you need to run two setup scripts:

1. Ingest the test data:
   ```bash
   npm run ingest
   ```

2. Create the necessary vector search index:
   ```bash
   npm run create-index
   ```

## Testing the Server Endpoints

The project includes a test script to verify the server endpoints are working correctly. To run the tests:

1. First, make sure your environment variables are set up in `.env`:
   ```
   MONGODB_HOST=your_mongodb_host
   MONGODB_USERNAME=your_username
   MONGODB_PASSWORD=your_password
   MONGODB_DB_NAME=your_database_name
   MONGODB_COLLECTION_NAME=your_collection_name
   ```

2. Start the server in one terminal:
   ```bash
   npm run start
   ```

3. In another terminal, run the test script:
   ```bash
   npm run test-server
   ```

The test script will verify the following endpoints:

### Health Check Endpoint
- **GET** `/health`
- Verifies the server is running and responding

### Document Insertion Endpoint
- **POST** `/documents`
- Tests inserting multiple documents with embeddings
- Example payload:
  ```json
  {
    "documents": [
      {
        "pageContent": "Your document text here",
        "metadata": {
          "source": "test"
        }
      }
    ]
  }
  ```

### Query Endpoint
- **GET** `/query?q=your%20query%20here`
- Tests semantic search functionality
- Returns relevant documents based on vector similarity

## Expected Test Output

The test script provides colored output indicating the success or failure of each test:
- ✓ Green checkmarks for successful tests
- ✗ Red X's for failed tests

Each test will show the server's response for verification.

## Manual Testing

You can also test the endpoints manually using curl:

```bash
# Health check
curl http://localhost:3000/health

# Insert documents
curl -X POST http://localhost:3000/documents \
  -H "Content-Type: application/json" \
  -d '{
    "documents": [
      {
        "pageContent": "Your document text here",
        "metadata": { "source": "test" }
      }
    ]
  }'

# Query documents
curl "http://localhost:3000/query?q=your%20query%20here"
```
