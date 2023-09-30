document.addEventListener("DOMContentLoaded", function () {
    // Get DOM elements
    const chatBox = document.getElementById("chat-box");
    const userInput = document.getElementById("user-input");
    const sendButton = document.getElementById("send-button");
    const googleModeButton = document.getElementById("google-mode-button");
    const voiceButton = document.getElementById("voice-button");
    const generateImageButton = document.getElementById("generate-image-button");
    const wikipediaButton = document.getElementById("wikipedia-button");
    const androidButton = document.getElementById("android-button");

    // Initialize state variables
    let isGoogleModeActive = false;
    let isListening = false;
    let recognition;

    // Voice button icons
    const voiceButtonIcons = ["🎙️", "🔴"];
    const defaultImageSize = "300px"; // Default image size

    // Toggle Google Mode button
    function toggleGoogleMode() {
        isGoogleModeActive = !isGoogleModeActive;
        updateButtonState(googleModeButton, isGoogleModeActive);
    }

    // Toggle Voice Recognition button
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

    // Request microphone permission
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

    // Handle classic conversation
    function classicConversation(query) {
        const responses = {
            "hello": "Hi there! How can I assist you today?",
            "how are you": "I'm just a chatbot, but I'm here to help. What can I do for you?",
            "what's your name": "I'm a chatbot created to assist with information and tasks.",
            "bye": "Goodbye! If you have more questions in the future, feel free to ask."
            // Add more query-response pairs as needed
        };

        const lowerCaseQuery = query.toLowerCase();

        if (responses.hasOwnProperty(lowerCaseQuery)) {
            const response = responses[lowerCaseQuery];
            appendMessage("AI Chatbot", response);
        } else {
            appendMessage("AI Chatbot", "I'm not sure how to respond to that.");
        }
    }

    // Send a user message
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

    // Update button state and add/remove "(active)" text
    function updateButtonState(button, isActive) {
        if (isActive) {
            button.classList.add("active");
            button.textContent += " (active)";
        } else {
            button.classList.remove("active");
            button.textContent = button.textContent.replace(" (active)", "");
        }
    }

    // Append a message to the chat box
    function appendMessage(sender, message) {
        const messageDiv = document.createElement("div");
        messageDiv.classList.add("chat-message");
        messageDiv.innerHTML = `<strong>${sender}:</strong> ${message}`;
        chatBox.appendChild(messageDiv);
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    // Fetch answers from Google
    function fetchAnswersFromGoogle(query) {
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

    // Initialize speech recognition
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

    // Fetch answers from Wikipedia
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

    // Generate an image
    function generateImage() {
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

    // Append an image to the chat box
    function appendImage(imageUrl) {
        const imageElement = document.createElement("img");
        imageElement.src = imageUrl;
        imageElement.style.maxWidth = defaultImageSize;
        chatBox.appendChild(imageElement);
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    // Handle Enter key press for sending messages
    userInput.addEventListener("keydown", function (event) {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            sendMessage();
        }
    });

    // Add click event listeners for buttons
    sendButton.addEventListener("click", sendMessage);
    googleModeButton.addEventListener("click", toggleGoogleMode);
    voiceButton.addEventListener("click", toggleVoiceRecognition);
    generateImageButton.addEventListener("click", generateImage);
    wikipediaButton.addEventListener("click", showWikipedia);
    androidButton.addEventListener("click", downloadApk);

    // Handle Wikipedia button behavior
    function showWikipedia() {
        if (wikipediaButton.classList.contains("active")) {
            fetchAnswersFromWikipedia(userInput.value.trim());
        }
    }

    // Handle Android app download
    function downloadApk() {
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
