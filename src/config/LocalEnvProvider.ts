import { ConfigProvider } from './ConfigProvider';
import * as dotenv from 'dotenv';

/**
 * Configuration provider that reads from local .env file and process.env
 */
export class LocalEnvProvider implements ConfigProvider {
    async init(): Promise<void> {
        // Load .env file if it exists
        dotenv.config();
    }

    async get(key: string): Promise<string | undefined> {
        return process.env[key];
    }
}
