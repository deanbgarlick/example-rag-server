export interface VectorSearchIndex {
    name: string;
    type: string;
    definition: {
        fields: {
            type: string;
            path: string;
            similarity: string;
            numDimensions: number;
        }[];
    };
}