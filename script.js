document.addEventListener("DOMContentLoaded", function () {
    const chatBox = document.getElementById("chat-box");
    const userInput = document.getElementById("user-input");
    const sendButton = document.getElementById("send-button");
    const googleModeButton = document.getElementById("google-mode-button");
    const voiceButton = document.getElementById("voice-button");
    const generateImageButton = document.getElementById("generate-image-button");
    const wikipediaButton = document.getElementById("wikipedia-button");
    const androidButton = document.getElementById("android-button");

    let isGoogleModeActive = false;
    let isListening = false;
    let recognition;

    const voiceButtonIcons = ["🎙️", "🔴"];
    const defaultImageSize = "200px"; // Default image size

    function toggleGoogleMode() {
        isGoogleModeActive = !isGoogleModeActive;
        updateButtonState(googleModeButton, isGoogleModeActive);
    }

    function toggleVoiceRecognition() {
        if (!isListening) {
            if (!recognition) {
                initSpeechRecognition();
            }
            requestMicrophonePermission()
                .then((permissionGranted) => {
                    if (permissionGranted) {
                        recognition.start();
                    } else {
                        console.error("Microphone permission denied.");
                    }
                })
                .catch((error) => {
                    console.error("Error requesting microphone permission:", error);
                });
        } else {
            recognition.stop();
        }
    }

    function requestMicrophonePermission() {
        return new Promise((resolve) => {
            navigator.mediaDevices
                .getUserMedia({ audio: true })
                .then((stream) => {
                    stream.getTracks().forEach((track) => track.stop());
                    resolve(true);
                })
                .catch(() => {
                    resolve(false);
                });
        });
    }

    function classicConversation(query) {
        // Define predefined responses based on user queries
        const responses = {
            "hello": "Hi there! How can I assist you today?",
            "how are you": "I'm just a chatbot, but I'm here to help. What can I do for you?",
            "what's your name": "I'm a chatbot created to assist with information and tasks.",
            "bye": "Goodbye! If you have more questions in the future, feel free to ask.",
            // Add more query-response pairs as needed
        };

        // Convert the user's query to lowercase for case-insensitive matching
        const lowerCaseQuery = query.toLowerCase();

        // Check if there's a predefined response for the user's query
        if (responses.hasOwnProperty(lowerCaseQuery)) {
            const response = responses[lowerCaseQuery];
            appendMessage("AI Chatbot", response);
        } else {
            // If no predefined response matches, provide a default response
            appendMessage("AI Chatbot", "I'm not sure how to respond to that.");
        }
    }

    function sendMessage() {
        const userMessage = userInput.value.trim();

        if (userMessage !== "") {
            appendMessage("You", userMessage);

            if (isGoogleModeActive) {
                fetchAnswersFromGoogle(userMessage);
            } else {
                if (wikipediaButton.classList.contains("active")) {
                    fetchAnswersFromWikipedia(userMessage);
                } else {
                    classicConversation(userMessage);
                }
            }

            userInput.value = "";
        }
    }

    function updateButtonState(button, isActive) {
        if (isActive) {
            button.classList.add("active");
        } else {
            button.classList.remove("active");
        }
    }

    function appendMessage(sender, message) {
        const messageDiv = document.createElement("div");
        messageDiv.classList.add("chat-message");
        messageDiv.innerHTML = `<strong>${sender}:</strong> ${message}`;
        chatBox.appendChild(messageDiv);
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    function fetchAnswersFromGoogle(query) {
        // Replace with your Google API Key and Custom Search Engine ID
        const googleApiKey = 'AIzaSyDPVqP6l-NdTAJ1Zg5oKFiLORz-M5tDZvE';
        const googleEngineId = 'e66093057c55d4a1d';

        axios.get(`https://www.googleapis.com/customsearch/v1?key=${googleApiKey}&cx=${googleEngineId}&q=${query}`)
            .then((response) => {
                const searchResults = response.data.items;

                if (searchResults && searchResults.length > 0) {
                    const topResult = searchResults[0];
                    const title = topResult.title;
                    const snippet = topResult.snippet;
                    const link = topResult.link;

                    const googleResponse = `AI Chatbot: ${title}. Here's a snippet: ${snippet}<br><a href="${link}" target="_blank">Read more</a>`;
                    appendMessage("AI Chatbot", googleResponse);
                } else {
                    const noResultsResponse = "AI Chatbot: I couldn't find any relevant results.";
                    appendMessage("AI Chatbot", noResultsResponse);
                }
            })
            .catch((error) => {
                console.error("Error fetching Google results:", error);
                const errorMessage = "AI Chatbot: Sorry, I encountered an error while fetching results from Google.";
                appendMessage("AI Chatbot", errorMessage);
            });
    }

    function initSpeechRecognition() {
        recognition = new webkitSpeechRecognition() || new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onstart = () => {
            isListening = true;
            voiceButton.textContent = voiceButtonIcons[1];
            console.log("Listening...");
        };

        recognition.onresult = (event) => {
            const result = event.results[0][0].transcript;
            userInput.value = result;
            sendMessage();
            recognition.stop();
        };

        recognition.onend = () => {
            isListening = false;
            voiceButton.textContent = voiceButtonIcons[0];
            console.log("Stopped listening.");
        };

        recognition.onerror = (event) => {
            console.error("Speech recognition error:", event.error);
            isListening = false;
        };
    }

    function fetchAnswersFromWikipedia(query) {
        axios.get(`https://en.wikipedia.org/w/api.php?action=opensearch&search=${query}&format=json`)
            .then((response) => {
                const searchResults = response.data;

                if (searchResults[1].length > 0) {
                    const title = searchResults[1][0];
                    const snippet = searchResults[2][0];
                    const link = searchResults[3][0];

                    const wikipediaResponse = `AI Chatbot: ${title}. Here's a snippet: ${snippet}<br><a href="${link}" target="_blank">Read more</a>`;
                    appendMessage("AI Chatbot", wikipediaResponse);
                } else {
                    const noResultsResponse = "AI Chatbot: I couldn't find any relevant results on Wikipedia.";
                    appendMessage("AI Chatbot", noResultsResponse);
                }
            })
            .catch((error) => {
                console.error("Error fetching Wikipedia results:", error);
                const errorMessage = "AI Chatbot: Sorry, I encountered an error while fetching results from Wikipedia.";
                appendMessage("AI Chatbot", errorMessage);
            });
    }

    function generateImage() {
        // Replace with your Unsplash API Key
        const unsplashApiKey = 'zqNisiBRmXaNPPir5g3bwSfkWnTzaQSII6C4EF3l-54';

        axios.get(`https://api.unsplash.com/photos/random?client_id=${unsplashApiKey}&query=nature`)
            .then((response) => {
                if (response.data && response.data.urls && response.data.urls.regular) {
                    const imageUrl = response.data.urls.regular;
                    appendImage(imageUrl);
                } else {
                    appendMessage("AI Chatbot", "I couldn't find any image at the moment.");
                }
            })
            .catch((error) => {
                console.error("Error fetching image from Unsplash:", error);
                appendMessage("AI Chatbot", "Sorry, I encountered an error while fetching an image.");
            });
    }

    function appendImage(imageUrl) {
        const imageElement = document.createElement("img");
        imageElement.src = imageUrl;
        imageElement.style.maxWidth = defaultImageSize; // Set the image size
        chatBox.appendChild(imageElement);
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    userInput.addEventListener("keydown", function (event) {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            sendMessage();
        }
    });

    sendButton.addEventListener("click", sendMessage);
    googleModeButton.addEventListener("click", toggleGoogleMode);
    voiceButton.addEventListener("click", toggleVoiceRecognition);
    generateImageButton.addEventListener("click", generateImage);
    wikipediaButton.addEventListener("click", showWikipedia);
    androidButton.addEventListener("click", downloadApk);

    function showWikipedia() {
        if (wikipediaButton.classList.contains("active")) {
            // Only fetch Wikipedia if the button is active
            fetchAnswersFromWikipedia(userInput.value.trim());
        }
    }

    // Function to handle the Android app download
    function downloadApk() {
        // Replace with the code to handle the Android app download with a file path
        const androidAppFilePath = '/aichat/AI-Chatbot.apk'; // Replace with your file path
        const androidAppDownloadLink = window.location.origin + androidAppFilePath;
        const downloadLink = document.createElement('a');
        downloadLink.href = androidAppDownloadLink;
        downloadLink.download = 'AI-Chatbot.apk';
        downloadLink.click();
        appendMessage("AI Chatbot", "Downloading the Android app...");
        downloadLink.remove();
    }
});
