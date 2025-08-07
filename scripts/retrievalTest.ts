import { getQueryResults } from '../src/getQueryResults';
import { getMongoConfig } from '../src/utils/config';

async function run(): Promise<void> {
    try {
        const config = getMongoConfig();
        const query = "AI Technology";
        const documents = await getQueryResults(query, config);
        
        documents.forEach(doc => {
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