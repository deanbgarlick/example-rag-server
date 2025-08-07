import { Request } from 'express';
import { Document } from 'langchain/document';

export interface DocumentInsertRequest {
    documents: {
        pageContent: string;
        metadata?: Record<string, any>;
    }[];
}

export interface DocumentInsertResponse {
    success: boolean;
    insertedCount: number;
}

export interface QueryResponse {
    success: boolean;
    results: {
        document: {
            pageContent: string;
        };
    }[];
}

export interface HealthResponse {
    status: string;
}

// Type guard for DocumentInsertRequest
export function isDocumentInsertRequest(body: any): body is DocumentInsertRequest {
    return Array.isArray(body?.documents) && 
           body.documents.every((doc: any) => 
               typeof doc === 'object' && 
               typeof doc.pageContent === 'string'
           );
}

// Extend Express Request for type safety
export interface TypedRequest<T> extends Request {
    body: T;
}
