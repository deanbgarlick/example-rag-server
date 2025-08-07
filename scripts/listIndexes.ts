import { MongoClient } from 'mongodb';

async function listIndexes() {
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
        
        console.log('Connected to MongoDB, listing indexes...');
        
        const indexes = await collection.listIndexes().toArray();
        console.log('Indexes:', JSON.stringify(indexes, null, 2));
        
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await client.close();
    }
}

listIndexes().catch(console.error);
