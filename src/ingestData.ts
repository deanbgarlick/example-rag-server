import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { MongoClient, Db, Collection, InsertManyResult } from 'mongodb';
import { getEmbedding } from './getEmbedding';
import * as fs from 'fs';
import { Document } from 'langchain/document';

interface DocumentWithEmbedding {
    document: Document;
    embedding: number[];
}

async function run(): Promise<void> {
    if (!process.env.MONGODB_HOST || !process.env.MONGODB_USERNAME || !process.env.MONGODB_PASSWORD) {
        throw new Error('MongoDB credentials are required');
    }
    
    const connectionString = process.env.MONGODB_HOST.replace(
        'mongodb+srv://',
        `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@`
    );
    
    const client: MongoClient = new MongoClient(connectionString);
    
    try {
        // Save online PDF as a file
        const rawData: Response = await fetch("https://investors.mongodb.com/node/12236/pdf");
        const pdfBuffer: ArrayBuffer = await rawData.arrayBuffer();
        const pdfData: Buffer = Buffer.from(pdfBuffer);
        fs.writeFileSync("investor-report.pdf", pdfData);

        const loader: PDFLoader = new PDFLoader("investor-report.pdf");
        const data: Document[] = await loader.load();

        // Chunk the text from the PDF
        const textSplitter: RecursiveCharacterTextSplitter = new RecursiveCharacterTextSplitter({
            chunkSize: 400,
            chunkOverlap: 20,
        });

        const docs: Document[] = await textSplitter.splitDocuments(data);
        console.log(`Successfully chunked the PDF into ${docs.length} documents.`);

        // Connect to your Atlas cluster
        await client.connect();
        const db: Db = client.db("rag_db");
        const collection: Collection = db.collection("test");
        
        console.log("Generating embeddings and inserting documents...");
        const insertDocuments: DocumentWithEmbedding[] = [];

        await Promise.all(docs.map(async (doc: Document) => {
            // Generate embeddings using the function that you defined
            const embedding: number[] = await getEmbedding(doc.pageContent);
            
            // Add the document with the embedding to array of documents for bulk insert
            insertDocuments.push({
                document: doc,
                embedding: embedding
            });
        }));

        // Continue processing documents if an error occurs during an operation
        const options = { ordered: false };
        
        // Insert documents with embeddings into Atlas
        const result: InsertManyResult<DocumentWithEmbedding> = 
            await collection.insertMany(insertDocuments, options);
            
        console.log("Count of documents inserted: " + result.insertedCount);
    } catch (err) {
        if (err instanceof Error) {
            console.log(err.stack);
        } else {
            console.log('An unexpected error occurred:', err);
        }
    } finally {
        await client.close();
    }
}

run().catch(console.dir);
