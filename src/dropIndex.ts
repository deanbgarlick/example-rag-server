import { MongoClient } from 'mongodb';

async function dropSearchIndex() {
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
        
        console.log('Connected to MongoDB, attempting to drop index...');
        
        const result = await collection.dropIndex("vector_index");
        console.log('Index dropped successfully:', result);
        
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await client.close();
    }
}

dropSearchIndex().catch(console.error);