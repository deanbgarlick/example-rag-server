import { MongoClient } from 'mongodb';

async function dropCollection() {
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
        
        console.log('Connected to MongoDB, dropping collection...');
        
        await db.collection("test").drop();
        console.log('Collection dropped successfully');
        
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await client.close();
    }
}

dropCollection().catch(console.error);
