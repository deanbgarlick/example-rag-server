import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { MongoConfig } from './types/MongoConfig';
import { healthCheck } from './controllers/healthController';
import { insertDocumentsHandler } from './controllers/documentsController';
import { queryDocuments } from './controllers/queryController';

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB configuration from environment variables
const mongoConfig: MongoConfig = {
    host: process.env.MONGODB_HOST || '',
    username: process.env.MONGODB_USERNAME || '',
    password: process.env.MONGODB_PASSWORD || '',
    dbName: process.env.MONGODB_DB_NAME || '',
    collectionName: process.env.MONGODB_COLLECTION_NAME || ''
};

// Health check endpoint
app.get('/health', healthCheck);

// Document insertion endpoint
app.post('/documents', (req, res, next) => 
    insertDocumentsHandler(req, res, next, mongoConfig)
);

// Query results endpoint
app.get('/query', (req, res, next) => 
    queryDocuments(req, res, next, mongoConfig)
);

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).json({
        error: 'Internal Server Error',
        message: err.message
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});