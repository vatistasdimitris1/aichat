// imgix.js

// Replace these with your Cloudinary credentials
const cloudName = "ddq5s6zh1";
const apiKey = "376164715446421";
const apiSecret = "av-GMm5ZHUQXV40j36kkj4H_Ucc";

// Function to edit an image using Cloudinary
function editImageWithCloudinary(imageUrl, transformations) {
    const cloudinaryUrl = `https://res.cloudinary.com/${cloudName}/image/upload/${transformations}/${imageUrl}`;

    // Use the edited image URL as needed (e.g., set as the source for an <img> element)
    return cloudinaryUrl;
}

// Function to handle image generation when the button is clicked
function handleImageGeneration() {
    const fileInput = document.getElementById("image-upload");
    const generateButton = document.getElementById("generate-button");
    const editedImageElement = document.getElementById("edited-image");

    if (fileInput.files.length === 0) {
        alert("Please select an image to edit.");
        return;
    }

    // Disable the button while processing the image
    generateButton.disabled = true;

    const file = fileInput.files[0];
    const formData = new FormData();
    formData.append("file", file);

    // Upload the selected image to Cloudinary
    fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: formData,
        headers: {
            Authorization: `Basic ${btoa(`${apiKey}:${apiSecret}`)}`,
        },
    })
    .then((response) => response.json())
    .then((data) => {
        if (data.secure_url) {
            const imageUrl = data.secure_url;
            const transformations = "w_300,h_200,c_fill"; // Add desired Cloudinary transformations

            const editedImageUrl = editImageWithCloudinary(imageUrl, transformations);

            // Set the edited image URL as the source for an <img> element
            editedImageElement.src = editedImageUrl;

            // Re-enable the button
            generateButton.disabled = false;
        } else {
            alert("Error uploading the image to Cloudinary.");
            generateButton.disabled = false;
        }
    })
    .catch((error) => {
        console.error("Error uploading the image:", error);
        alert("An error occurred while uploading the image to Cloudinary.");
        generateButton.disabled = false;
    });
}

// Add an event listener to the button with id "generate-button"
const generateButton = document.getElementById("generate-button");
generateButton.addEventListener("click", handleImageGeneration);
