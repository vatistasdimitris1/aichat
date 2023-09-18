// Import the OpenAI package if using ES modules (adjust for your project setup)
import OpenAI from "openai";

// Function to make the OpenAI chat request
async function makeOpenAIChatRequest() {
  try {
    const openai = new OpenAI({
      apiKey: process.env.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, // Make sure your API key is accessible here
    });

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant.", // Optional system message
        },
        {
          role: "user",
          content: "What's the weather like today?",
        },
      ],
      temperature: 0.7,
      max_tokens: 50,
    });

    // Handle the response here
    console.log(response.data.choices[0].message.content);
  } catch (error) {
    // Handle errors
    console.error("Error making OpenAI chat request:", error);
  }
}

// Call the function when you want to make the request
makeOpenAIChatRequest();
