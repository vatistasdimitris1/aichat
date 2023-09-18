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
            axios.post('https://api.openai.com/v1/images/generate', {
                prompt: userPrompt,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`,
                },
            })
            .then(function (response) {
                const generatedImageUrl = response.data.images[0].url;
                // Display the generated image on your website as needed
                const imageElement = document.createElement("img");
                imageElement.src = generatedImageUrl;
                chatBox.appendChild(imageElement);

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
        // Retrieve the generated image URL
        const generatedImage = document.querySelector("img");
        const imageUrl = generatedImage.src;

        // Create a temporary anchor element to trigger the download
        const downloadLink = document.createElement('a');
        downloadLink.href = imageUrl;
        downloadLink.download = 'generated-image.png'; // Specify the desired file name
        downloadLink.style.display = 'none';
        document.body.appendChild(downloadLink);

        // Trigger the click event to start the download
        downloadLink.click();

        // Clean up
        document.body.removeChild(downloadLink);
    }
});
