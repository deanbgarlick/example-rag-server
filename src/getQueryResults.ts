import { MongoService, MongoConfig } from './services/MongoService';
import { getEmbedding } from './getEmbedding';

interface QueryDocument {
    document: {
        pageContent: string;
    };
}

export async function getQueryResults(
    query: string,
    config: MongoConfig
): Promise<QueryDocument[]> {
    return MongoService.withClient(config, async (mongoService) => {
        const queryEmbedding: number[] = await getEmbedding(query);
        const collection = mongoService.getCollection();
        
        const pipeline = [
            {
                $vectorSearch: {
                    index: "vector_index",
                    queryVector: queryEmbedding,
                    path: "embedding",
                    exact: true,
                    limit: 5
                }
            },
            {
                $project: {
                    _id: 0,
                    document: 1,
                }
            }
        ];

        const result = collection.aggregate(pipeline);
        const arrayOfQueryDocs: QueryDocument[] = [];
        
        for await (const doc of result) {
            arrayOfQueryDocs.push(doc as QueryDocument);
        }
        
        return arrayOfQueryDocs;
    }).catch(err => {
        if (err instanceof Error) {
            console.log(err.stack);
        } else {
            console.log('An unexpected error occurred:', err);
        }
        return [];
    });
}