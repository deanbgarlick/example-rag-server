import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import * as fs from 'fs';
import { insertDocuments, splitDocuments } from '../src/insertDocuments';
import type { MongoConfig } from '../src/services/MongoService';

async function run(): Promise<void> {
    if (!process.env.MONGODB_HOST || !process.env.MONGODB_USERNAME || !process.env.MONGODB_PASSWORD) {
        throw new Error('MongoDB credentials are required');
    }

    const mongoConfig: MongoConfig = {
        host: process.env.MONGODB_HOST,
        username: process.env.MONGODB_USERNAME,
        password: process.env.MONGODB_PASSWORD,
        dbName: "rag_db",
        collectionName: "test"
    };
    
    try {
        // Save online PDF as a file
        const rawData: Response = await fetch("https://investors.mongodb.com/node/12236/pdf");
        const pdfBuffer: ArrayBuffer = await rawData.arrayBuffer();
        const pdfData: Buffer = Buffer.from(pdfBuffer);
        fs.writeFileSync("investor-report.pdf", pdfData);

        // Load and process the PDF
        const loader: PDFLoader = new PDFLoader("investor-report.pdf");
        const data = await loader.load();
        
        // Split into chunks
        const docs = await splitDocuments(data);
        console.log(`Successfully chunked the PDF into ${docs.length} documents.`);

        // Insert documents with embeddings
        const insertedCount = await insertDocuments(docs, mongoConfig);
        console.log("Count of documents inserted:", insertedCount);

    } catch (err) {
        if (err instanceof Error) {
            console.log(err.stack);
        } else {
            console.log('An unexpected error occurred:', err);
        }
    }
}

run().catch(console.dir);