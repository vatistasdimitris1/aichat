// Replace 'your-api-key' with your actual OpenAI API key
const apiKey = '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';

document.addEventListener("DOMContentLoaded", function () {
    const userInput = document.getElementById("user-input");
    const imageButton = document.getElementById("image-button");
    const chatBox = document.getElementById("chat-box");
    const downloadButton = document.getElementById("download-button");

    imageButton.addEventListener("click", generateImage);
    downloadButton.addEventListener("click", downloadImage);

    function generateImage() {
        const userPrompt = userInput.value.trim();
        if (userPrompt !== "") {
            axios.post('https://api.openai.com/v1/davinci/images/generate', {
                prompt: userPrompt,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`,
                },
            })
            .then(function (response) {
                const generatedImageData = response.data; // This will contain the generated image data
                // You can display the image or manipulate it as needed
                // For example, you can create an <img> element and set its 'src' attribute with the image data

                // Show the "Download Image" button
                downloadButton.style.display = "inline";
            })
            .catch(function (error) {
                console.error(error);
                appendMessage("AI Chatbot", "An error occurred while generating the image.");
            });
        }
    }

    function downloadImage() {
        // You can implement the image download logic here if needed
        // Retrieve the generated image data and save it as a file
    }
});
