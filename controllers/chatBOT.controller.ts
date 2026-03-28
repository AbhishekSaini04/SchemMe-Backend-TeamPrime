import OpenAI from "openai";

// Initialize client
const openai = new OpenAI({
  apiKey: process.env.NVIDIA_API_KEY as string,
  baseURL: "https://integrate.api.nvidia.com/v1",
});

/**
 * Chatbot function for government scheme queries
 * @param prompt User input
 * @param language Response language
 * @returns string response
 */
export async function chatBOT(
  prompt: string,
  language: string,
): Promise<string> {
  console.log("User Prompt:", prompt);

  try {
    // STEP 3: Generate response
    const completion = await openai.chat.completions.create({
      model: "openai/gpt-oss-20b",
      messages: [
        {
          role: "user",
          content: `
          RESPOND only if the query is about GOVERNMENT SCHEMES in India. If the query is unrelated, respond with "Sorry, I can only assist with government scheme queries."
--------------
if it asks about yourself, respond with "I am SBot, helpful assistant designed to provide information about government schemes in India. How can I assist you today?"
        -----------------------------------------

give the data in format like we are gonna use it in a chatbot and we want to give the best possible answer to the user query.
        ---------------
          User Query: ${prompt}

Instructions:
- Explain clearly and concisely
- Keep response short and informative
- Use a helpful government official tone
- Respond ONLY in ${language}

Answer:`,
        },
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    return completion.choices[0]?.message?.content?.trim() || "";
  } catch (error: any) {
    console.error("❌ Error in chatBOT:", error.message);

    if (error.message?.includes("404")) {
      throw new Error("Model not found. Check NVIDIA model name.");
    }

    throw new Error("Something went wrong while processing the request.");
  }
}
