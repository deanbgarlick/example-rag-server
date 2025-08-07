import { Request, Response } from 'express';
import { HealthResponse } from '../types/api';

export const healthCheck = (req: Request, res: Response<HealthResponse>) => {
    res.json({ status: 'ok' });
};
