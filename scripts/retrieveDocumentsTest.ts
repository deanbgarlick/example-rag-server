import { getQueryResults } from '../src/services/documents/queryDocuments';
import { getMongoConfig } from '../src/services/mongo/config';
import { QueryDocument } from '../src/types/QueryDocument';

async function run(): Promise<void> {
    try {
        const config = getMongoConfig();
        const query: string = "AI Technology";
        const documents: QueryDocument[] = await getQueryResults(query, config);
        
        documents.forEach((doc: QueryDocument) => {
            console.log("\nDocument content:", doc.document.pageContent);
        }); 
    } catch (err) {
        if (err instanceof Error) {
            console.log(err.stack);
        } else {
            console.log('An unexpected error occurred:', err);
        }
    }
}

run().catch(console.dir);