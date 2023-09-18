// Import OpenAI library
import OpenAI from "openai";

// Replace 'your-api-key' with your actual OpenAI API key
const apiKey = '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';

// Initialize OpenAI instance
const openai = new OpenAI({ apiKey });

document.addEventListener("DOMContentLoaded", function () {
    const userInput = document.getElementById("user-input");
    const imageButton = document.getElementById("image-button");
    const chatBox = document.getElementById("chat-box");
    const downloadButton = document.getElementById("download-button");
    const generatedImage = document.getElementById("generated-image"); // Reference to the <img> element

    imageButton.addEventListener("click", generateImage);
    downloadButton.style.display = "none"; // Hide the "Download" button initially

    async function generateImage() {
        const userPrompt = userInput.value.trim();
        if (userPrompt !== "") {
            try {
                const response = await openai.images.generate({ prompt: userPrompt });
                const imageUrls = response.data.map((imageData) => imageData.url);
                if (imageUrls.length > 0) {
                    // Display the generated image by setting the 'src' attribute of the <img> element
                    const generatedImageUrl = imageUrls[0];
                    generatedImage.src = generatedImageUrl; // Set the 'src' attribute

                    // Show the "Download" button
                    downloadButton.style.display = "inline";
                } else {
                    console.error("No image URL received from OpenAI.");
                    appendMessage("AI Chatbot", "An error occurred while generating the image.");
                }
            } catch (error) {
                console.error(error);
                appendMessage("AI Chatbot", "An error occurred while generating the image.");
            }
        }
    }

  downloadButton.addEventListener("click", downloadImage);

    function downloadImage() {
        // Retrieve the image URL from the "data-image-url" attribute
        const imageUrl = downloadButton.dataset.imageUrl;
        if (imageUrl) {
            // Create an anchor element to trigger the download
            const downloadLink = document.createElement("a");
            downloadLink.href = imageUrl;
            downloadLink.download = "generated-image.png"; // Specify the desired file name
            downloadLink.style.display = "none";
            document.body.appendChild(downloadLink);

            // Trigger the click event to start the download
            downloadLink.click();

            // Clean up
            document.body.removeChild(downloadLink);
        }
    }
});
