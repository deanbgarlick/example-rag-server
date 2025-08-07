import { getQueryResults } from './getQueryResults';
import OpenAI from 'openai';

interface DocumentWithPageContent {
    document: {
        pageContent: string;
    };
}

async function run(): Promise<void> {
    try {
        // Specify search query and retrieve relevant documents
        const question: string = "In a few sentences, what are MongoDB's latest AI announcements?";
        const documents: DocumentWithPageContent[] = await getQueryResults(question);

        // Build a string representation of the retrieved documents to use in the prompt
        let textDocuments: string = "";
        documents.forEach((doc: DocumentWithPageContent) => {
            textDocuments += doc.document.pageContent;
        });

        // Create a prompt consisting of the question and context to pass to the LLM
        const prompt: string = `Answer the following question based on the given context.
            Question: {${question}}
            Context: {${textDocuments}}
        `;

        // Initialize OpenAI client
        const client: OpenAI = new OpenAI({
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
