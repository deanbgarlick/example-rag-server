import { Response, NextFunction } from 'express';
import { Document } from 'langchain/document';
import { insertDocuments, splitDocuments } from '../services/documents/documentOperations';
import { MongoConfig } from '../types/MongoConfig';
import { 
    DocumentInsertRequest, 
    DocumentInsertResponse,
    TypedRequest,
    isDocumentInsertRequest 
} from '../types/api';

export const insertDocumentsHandler = async (
    req: TypedRequest<DocumentInsertRequest>,
    res: Response<DocumentInsertResponse>,
    next: NextFunction,
    mongoConfig: MongoConfig
) => {
    try {
        if (!isDocumentInsertRequest(req.body)) {
            return res.status(400).json({
                success: false,
                insertedCount: 0,
                error: 'Invalid request format'
            } as DocumentInsertResponse);
        }

        // Convert plain objects to Document instances
        const docs = req.body.documents.map(doc => new Document({
            pageContent: doc.pageContent,
            metadata: doc.metadata || {}
        }));

        // Split documents into chunks
        const splitDocs = await splitDocuments(docs);
        
        // Insert documents and get count
        const insertedCount = await insertDocuments(splitDocs, mongoConfig);
        
        res.json({
            success: true,
            insertedCount
        });
    } catch (error) {
        next(error);
    }
};
