import { MongoClient } from 'mongodb';

async function listSearchIndexes() {
    if (!process.env.MONGODB_HOST || !process.env.MONGODB_USERNAME || !process.env.MONGODB_PASSWORD) {
        throw new Error('MongoDB credentials are required');
    }
    
    const connectionString = process.env.MONGODB_HOST.replace(
        'mongodb+srv://',
        `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@`
    );
    
    const client = new MongoClient(connectionString);
    
    try {
        await client.connect();
        const db = client.db("rag_db");
        const collection = db.collection("test");
        
        console.log('Connected to MongoDB, listing search indexes...');
        
        // Using the MongoDB command to list search indexes
        const result = await db.command({
            listSearchIndexes: collection.collectionName
        });
        
        console.log('Search Indexes:', JSON.stringify(result, null, 2));
        
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await client.close();
    }
}

listSearchIndexes().catch(console.error);
