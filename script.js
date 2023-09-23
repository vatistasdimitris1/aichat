document.addEventListener("DOMContentLoaded", function () {
    const chatBox = document.getElementById("chat-box");
    const userInput = document.getElementById("user-input");
    const sendButton = document.getElementById("send-button");
    const generateImageButton = document.getElementById("generate-image-button");
    const googleModeButton = document.getElementById("google-mode-button");
    const gpt3ModeButton = document.getElementById("gpt3-mode-button");
    const voiceButton = document.getElementById("voice-button");
    const androidButton = document.getElementById("android-button");

    let isGoogleModeActive = false;
    let isGpt3ModeActive = false;
    let isListening = false;
    let recognition;

    // Function to initialize Speech Recognition
    function initSpeechRecognition() {
        if ("webkitSpeechRecognition" in window) {
            recognition = new webkitSpeechRecognition();
            recognition.continuous = true;
            recognition.interimResults = true;
            recognition.lang = "en-US";

            recognition.onstart = function () {
                isListening = true;
                voiceButton.textContent = "🔴"; // Change button text to indicate listening
            };

            recognition.onend = function () {
                isListening = false;
                voiceButton.textContent = "🎙️"; // Change button text back to microphone icon
            };

            recognition.onresult = function (event) {
                const result = event.results[event.results.length - 1][0].transcript;
                userInput.value = result;
                sendMessage();
            };
        } else {
            console.error("Speech recognition not supported in this browser.");
        }
    }

    // Function to toggle Google Mode
    function toggleGoogleMode() {
        isGoogleModeActive = !isGoogleModeActive;
        updateButtonState(googleModeButton, isGoogleModeActive);
    }

    // Function to toggle GPT-3 Mode
    function toggleGpt3Mode() {
        isGpt3ModeActive = !isGpt3ModeActive;
        updateButtonState(gpt3ModeButton, isGpt3ModeActive);
    }

    // Function to toggle Voice Recognition
    function toggleVoiceRecognition() {
        if (!isListening) {
            if (!recognition) {
                initSpeechRecognition();
            }
            requestMicrophonePermission()
                .then(function (permissionGranted) {
                    if (permissionGranted) {
                        recognition.start();
                    } else {
                        console.error("Microphone permission denied.");
                    }
                })
                .catch(function (error) {
                    console.error("Error requesting microphone permission:", error);
                });
        } else {
            recognition.stop();
        }
    }

    // Function to request microphone permission
    function requestMicrophonePermission() {
        return new Promise(function (resolve, reject) {
            navigator.mediaDevices
                .getUserMedia({ audio: true })
                .then(function (stream) {
                    stream.getTracks().forEach((track) => track.stop());
                    resolve(true);
                })
                .catch(function (error) {
                    resolve(false);
                });
        });
    }

    // Function to update button state (active or inactive)
    function updateButtonState(button, isActive) {
        if (isActive) {
            button.textContent = `${button.textContent.split(" ")[0]} (Active)`;
            button.classList.add("active");
        } else {
            button.textContent = button.textContent.split(" ")[0];
            button.classList.remove("active");
        }
    }

    // Function to append a message to the chat box
    function appendMessage(sender, message) {
        const messageDiv = document.createElement("div");
        messageDiv.classList.add("chat-message");
        messageDiv.innerHTML = `<strong>${sender}:</strong> ${message}`;
        chatBox.appendChild(messageDiv);
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    // Function to handle user messages and responses
    function sendMessage() {
        const userMessage = userInput.value.trim();

        if (userMessage !== "") {
            appendMessage("You", userMessage);

            if (isGoogleModeActive) {
                fetchAnswersFromGoogle(userMessage);
            } else if (isGpt3ModeActive) {
                interactWithGPT3(userMessage);
            } else if (userMessage.toLowerCase() === "help") {
                showHelpCommands();
            } else {
                const botResponse = chatbotResponse(userMessage);
                appendMessage("AI Chatbot", botResponse);
            }

            userInput.value = "";
        }
    }

    // Function to handle responses using a chatbot
    function chatbotResponse(userMessage) {
        const lowerCaseMessage = userMessage.toLowerCase();
        const responses = {
            "hello": "Hello! How can I assist you?",
            "hey": "Hello! How can I assist you?",
            "how are you": "I'm just a computer program, but I'm here to help!",
            "what is your name": "I'm your AI chatbot. You can call me Jarvis.",
            "bye": "Goodbye! If you have more questions, feel free to ask.",
            "default": "I'm not sure I understand. Can you please rephrase your question?"
        };

        for (const keyword in responses) {
            if (lowerCaseMessage.includes(keyword)) {
                return responses[keyword];
            }
        }

        return responses["default"];
    }

    // Function to fetch answers from Google
    function fetchAnswersFromGoogle(query) {
        const googleApiKey = 'AIzaSyDPVqP6l-NdTAJ1Zg5oKFiLORz-M5tDZvE';
        const googleEngineId = 'e66093057c55d4a1d';

        axios.get(`https://www.googleapis.com/customsearch/v1?key=${googleApiKey}&cx=${googleEngineId}&q=${query}`)
            .then(function (response) {
                const searchResults = response.data.items;

                if (searchResults && searchResults.length > 0) {
                    const topResult = searchResults[0];
                    const title = topResult.title;
                    const snippet = topResult.snippet;
                    const link = topResult.link; // Add the link

                    const googleResponse = `AI Chatbot: ${title}. Here's a snippet: ${snippet} <a href="${link}" target="_blank">Read more</a>`;
                    appendMessage("AI Chatbot", googleResponse);
                } else {
                    appendMessage("AI Chatbot", "I couldn't find any results for your query.");
                }
            })
            .catch(function (error) {
                console.error("Error fetching results from Google:", error);
                appendMessage("AI Chatbot", "I encountered an error while fetching results from Google.");
            });
    }

    // Function to interact with GPT-3
    function interactWithGPT3(prompt) {
        const apiKey = 'YOUR_GPT3_API_KEY';
        const apiUrl = 'https://api.openai.com/v1/engines/davinci/completions';

        axios.post(apiUrl, {
            prompt: prompt,
            max_tokens: 50
        }, {
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            }
        })
            .then(function (response) {
                const gpt3Response = response.data.choices[0].text;
                appendMessage("AI Chatbot", gpt3Response);
            })
            .catch(function (error) {
                console.error("Error interacting with GPT-3:", error);
                appendMessage("AI Chatbot", "I encountered an error while interacting with GPT-3.");
            });
    }

    // Function to display help commands
    function showHelpCommands() {
        const helpMessage = `
            AI Chatbot Help:
            - To ask a question, type your query and press Send.
            - You can enable Google Mode to search the web by clicking the Google button.
            - Enable GPT-3 Mode for creative responses by clicking the GPT-3 button.
            - Click the microphone button to start voice recognition.
            - Type 'help' to see these commands.
        `;
        appendMessage("AI Chatbot", helpMessage);
    }

    // Event listeners
    sendButton.addEventListener("click", sendMessage);
    userInput.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            sendMessage();
        }
    });
    googleModeButton.addEventListener("click", toggleGoogleMode);
    gpt3ModeButton.addEventListener("click", toggleGpt3Mode);
    voiceButton.addEventListener("click", toggleVoiceRecognition);

    // Initialize voice recognition if supported
    if ("webkitSpeechRecognition" in window) {
        voiceButton.style.display = "inline-block";
    }
    
    // Add image generation functionality
    generateImageButton.addEventListener("click", generateImage);

    function generateImage() {
        const deepaiApiKey = 'd909c5b4-55ac-4fbb-9b4c-36ac1646e577';

        axios.post('https://api.deepai.org/text2img', {
            text: userInput.value
        }, {
            headers: {
                'api-key': deepaiApiKey,
            },
        })
            .then(function (response) {
                const imageUrl = response.data.output_url;
                appendImage(imageUrl);
            })
            .catch(function (error) {
                console.error("Error generating image:", error);
                appendMessage("AI Chatbot", "I encountered an error while generating the image.");
            });
    }

    function appendImage(imageUrl) {
        const imageDiv = document.createElement("div");
        const image = document.createElement("img");
        image.src = imageUrl;
        imageDiv.appendChild(image);
        chatBox.appendChild(imageDiv);
        chatBox.scrollTop = chatBox.scrollHeight;
    }
});
