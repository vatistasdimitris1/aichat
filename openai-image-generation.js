// Import OpenAI library
import OpenAI from "openai";

// Replace 'your-api-key' with your actual OpenAI API key
const apiKey = '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';

// Initialize OpenAI instance
const openai = new OpenAI({ apiKey });

// Function to generate an image
async function generateImage(prompt) {
    try {
        const response = await openai.images.generate({ prompt });
        const imageUrls = response.data.map((imageData) => imageData.url);
        if (imageUrls.length > 0) {
            // Display the generated image by setting the 'src' attribute of the <img> element
            const generatedImageUrl = imageUrls[0];
            const generatedImage = document.getElementById("generated-image");
            generatedImage.src = generatedImageUrl; // Set the 'src' attribute
        } else {
            console.error("No image URL received from OpenAI.");
            appendMessage("AI Chatbot", "An error occurred while generating the image.");
        }
    } catch (error) {
        console.error(error);
        appendMessage("AI Chatbot", "An error occurred while generating the image.");
    }
}

// Event listener for the "Image" button
const imageButton = document.getElementById("image-button");
imageButton.addEventListener("click", function () {
    const userInput = document.getElementById("user-input").value.trim();
    if (userInput !== "") {
        generateImage(userInput);
    }
});
