import { getQueryResults } from '../src/services/documents/queryDocuments';
import { getMongoConfig } from '../src/services/mongo/config';
import OpenAI from 'openai';

async function run(): Promise<void> {
    try {
        // Get MongoDB configuration
        const mongoConfig = getMongoConfig();

        // Specify search query and retrieve relevant documents
        const question = "In a few sentences, what are MongoDB's latest AI announcements?";
        const documents = await getQueryResults(question, mongoConfig);

        // Build a string representation of the retrieved documents to use in the prompt
        let textDocuments = "";
        documents.forEach((doc: { document: { pageContent: string } }) => {
            textDocuments += doc.document.pageContent;
        });

        // Create a prompt consisting of the question and context to pass to the LLM
        const prompt = `Answer the following question based on the given context.
            Question: {${question}}
            Context: {${textDocuments}}
        `;

        // Initialize OpenAI client
        if (!process.env.OPENAI_API_KEY) {
            throw new Error('OpenAI API key is required');
        }

        const client = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });

        // Prompt the LLM to generate a response based on the context
        const chatCompletion = await client.chat.completions.create({
            model: "gpt-4",
            messages: [
                {
                    role: "user",
                    content: prompt
                },
            ],
        });

        // Output the LLM's response as text.
        console.log(chatCompletion.choices[0].message.content);
    } catch (err) {
        if (err instanceof Error) {
            console.log(err.stack);
        } else {
            console.log('An unexpected error occurred:', err);
        }
    }
}

run().catch(console.dir);