import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { MongoConfig } from './types/MongoConfig';
import { healthCheck } from './controllers/healthController';
import { insertDocumentsHandler } from './controllers/documentsController';
import { queryDocuments } from './controllers/queryController';
import { ConfigManager } from './config/ConfigManager';
import { OpenAIEmbedder } from './services/embeddings/embedders/OpenAIEmbedder';
import { initializeEmbeddingService } from './services/embeddings/embeddingService';

async function startServer() {
    const app = express();
    const port = process.env.PORT || 3000;

    // Middleware
    app.use(cors());
    app.use(express.json());

    // Initialize configuration manager
    console.log('Initializing configuration...');
    const configManager = ConfigManager.getInstance();
    await configManager.init();
    const config = configManager.getConfig();

    // Initialize services with config
    const embedder = OpenAIEmbedder.fromConfig(config);
    initializeEmbeddingService(embedder);

    const mongoConfig: MongoConfig = {
        host: config.mongodbHost,
        username: config.mongodbUsername,
        password: config.mongodbPassword,
        dbName: config.mongodbDbName,
        collectionName: config.mongodbCollectionName
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
}

// Start the server and handle any errors
startServer().catch(error => {
    console.error('Failed to start server:', error);
    process.exit(1);
});