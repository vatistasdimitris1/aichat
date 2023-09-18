import OpenAI from "openai";

// Replace 'your-api-key' with your actual OpenAI API key
const apiKey = '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';

const openai = new OpenAI({ apiKey });

async function generateImage(prompt) {
  try {
    const response = await openai.images.generate({
      prompt: prompt,
    });

    if (response.data && response.data.length > 0) {
      const imageUrl = response.data[0].url;
      // Display the generated image on your website as needed
      // For example, you can create an <img> element and set its 'src' attribute to the generated image URL
      const imageElement = document.createElement("img");
      imageElement.src = imageUrl;
      document.getElementById("chat-box").appendChild(imageElement);

      // Show the download button when the image is ready
      document.getElementById("download-button").style.display = "inline";
    } else {
      console.error("No image URL found in the response.");
    }
  } catch (error) {
    console.error("Error generating image:", error);
  }
}

// Add an event listener to the image button
document.getElementById("image-button").addEventListener("click", function () {
  const userInput = document.getElementById("user-input").value;
  generateImage(userInput);
});

// Function to handle the download button click
document.getElementById("download-button").addEventListener("click", function () {
  const generatedImage = document.querySelector("#chat-box img");
  if (generatedImage) {
    const imageURL = generatedImage.src;
    // Create a temporary anchor element to trigger the download
    const downloadLink = document.createElement("a");
    downloadLink.href = imageURL;
    downloadLink.download = "generated-image.png"; // Specify the desired file name
    downloadLink.style.display = "none";
    document.body.appendChild(downloadLink);

    // Trigger the click event to start the download
    downloadLink.click();

    // Clean up
    document.body.removeChild(downloadLink);
  } else {
    console.error("Generated image not found.");
  }
});
