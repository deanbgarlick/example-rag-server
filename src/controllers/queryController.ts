import { Request, Response, NextFunction } from 'express';
import { getQueryResults } from '../services/documents/queryDocuments';
import { MongoConfig } from '../types/MongoConfig';
import { QueryResponse } from '../types/api';

export const queryDocuments = async (
    req: Request,
    res: Response<QueryResponse>,
    next: NextFunction,
    mongoConfig: MongoConfig
) => {
    try {
        const query = req.query.q;
        
        if (!query || typeof query !== 'string') {
            return res.status(400).json({
                success: false,
                results: [],
                error: 'Query parameter "q" is required'
            } as QueryResponse);
        }

        const results = await getQueryResults(query, mongoConfig);
        
        res.json({
            success: true,
            results
        });
    } catch (error) {
        next(error);
    }
};
