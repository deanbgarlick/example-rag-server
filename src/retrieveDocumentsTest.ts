import { getQueryResults } from './getQueryResults.js';

interface QueryDocument {
    document: {
        pageContent: string;
    };
}

async function run(): Promise<void> {
    try {
        const query: string = "AI Technology";
        const documents: QueryDocument[] = await getQueryResults(query);
        
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