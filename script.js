document.addEventListener("DOMContentLoaded", function () {
    const chatBox = document.getElementById("chat-box");
    const userInput = document.getElementById("user-input");
    const sendButton = document.getElementById("send-button");
    const googleModeButton = document.getElementById("google-mode-button");
    const gpt3ModeButton = document.getElementById("gpt3-mode-button");
    const voiceButton = document.getElementById("voice-button");
    const androidButton = document.getElementById("android-button");
    const generateImageButton = document.getElementById("generate-image-button");
    const chatContainer = document.querySelector(".chat-container");

    let isGoogleModeActive = false;
    let isGpt3ModeActive = false;
    let isListening = false;
    let recognition;

    // Emoji icons for the "Voice" button
    const voiceButtonIcons = ["🎙️", "🔴"];

    const isMouseTrackingEnabled = window.innerWidth > 600;

  const cursor = document.createElement("div");
    cursor.classList.add("cursor");
    document.body.appendChild(cursor);

    document.addEventListener("mousemove", function (e) {
        const mouseX = e.clientX;
        const mouseY = e.clientY;

        cursor.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
    });

    googleModeButton.addEventListener("click", toggleGoogleMode);
    gpt3ModeButton.addEventListener("click", toggleGpt3Mode);
    sendButton.addEventListener("click", sendMessage);
    voiceButton.addEventListener("click", toggleVoiceRecognition);
    androidButton.addEventListener("click", downloadApk);
    generateImageButton.addEventListener("click", generateImage);

    function toggleGoogleMode() {
        isGoogleModeActive = !isGoogleModeActive;
        updateButtonState(googleModeButton, isGoogleModeActive);
    }

    function toggleGpt3Mode() {
        isGpt3ModeActive = !isGpt3ModeActive;
        updateButtonState(gpt3ModeButton, isGpt3ModeActive);
    }

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
            } else if (userMessage.toLowerCase().startsWith("generate image")) {
                // Extract the search query for Unsplash
                const searchQuery = userMessage.substring(14).trim();
                if (searchQuery !== "") {
                    generateImageFromUnsplash(searchQuery);
                } else {
                    appendMessage("AI Chatbot", "Please provide a search query for generating an image.");
                }
            } else {
                const botResponse = chatbotResponse(userMessage);
                appendMessage("AI Chatbot", botResponse);
            }

            userInput.value = "";
        }
    }

    function updateButtonState(button, isActive) {
        if (isActive) {
            button.textContent = `${button.textContent.split(" ")[0]} (Active)`;
            button.classList.add("active");
        } else {
            button.textContent = button.textContent.split(" ")[0];
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
                    const link = topResult.link;

                    const googleResponse = `AI Chatbot: ${title}. Here's a snippet: ${snippet}<br><a href="${link}" target="_blank">Read more</a>`;
                    appendMessage("AI Chatbot", googleResponse);
                } else {
                    const noResultsResponse = "AI Chatbot: I couldn't find any relevant results.";
                    appendMessage("AI Chatbot", noResultsResponse);
                }
            })
            .catch(function (error) {
                console.error("Error fetching Google results:", error);
                const errorMessage = "AI Chatbot: Sorry, I encountered an error while fetching results from Google.";
                appendMessage("AI Chatbot", errorMessage);
            });
    }

    function initSpeechRecognition() {
        recognition = new webkitSpeechRecognition() || new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onstart = function () {
            isListening = true;
            voiceButton.innerHTML = voiceButtonIcons[1]; // Change the emoji to the "stop" icon
            console.log("Listening...");
        };

        recognition.onresult = function (event) {
            const result = event.results[0][0].transcript;
            userInput.value = result;
            sendMessage();
            recognition.stop();
        };

        recognition.onend = function () {
            isListening = false;
            voiceButton.innerHTML = voiceButtonIcons[0]; // Change the emoji back to the "microphone" icon
            console.log("Stopped listening.");
        };

        recognition.onerror = function (event) {
            console.error("Speech recognition error:", event.error);
            isListening = false;
        };
    }

    function downloadApk() {
        const apkLink = "AI-Chatbot.apk";
        window.open(apkLink, "_blank");
    }

    function showHelpCommands() {
        const helpMessage = "Available commands:<br>1. Type 'hello' or 'hey' to greet the chatbot.<br>2. Ask questions like 'What is your name?' or 'How are you?'<br>3. Type 'bye' to say goodbye.<br>4. Use 'help' to see available commands.";
        appendMessage("AI Chatbot", helpMessage);
    }

    // Function to generate image from Unsplash
    function generateImageFromUnsplash(searchQuery) {
        const unsplashApiKey = '8q0rws8EKli9yg3iTgCL3q5ruPP4Bc8kmrMfTN9P2Lw';
        const unsplashSecretKey = 'dLmSko3vjSIbHKqhchZrHKoB3GEd-UMURULxOXnVsKY';

        axios.get(`https://api.unsplash.com/photos/random?query=${searchQuery}&client_id=${unsplashApiKey}`)
            .then(function (response) {
                const imageUrl = response.data.urls.regular;
                const imageLink = response.data.links.html;

                // Append the image to the chatbox
                appendImage(imageUrl);

                // Append the Unsplash link to the chatbox
                appendLink(imageLink);
            })
            .catch(function (error) {
                console.error("Error generating image from Unsplash:", error);
                appendMessage("AI Chatbot", "Sorry, I couldn't generate an image at the moment.");
            });
    }

    // Function to append an image to the chatbox
    function appendImage(imageUrl) {
        const imageDiv = document.createElement("div");
        imageDiv.classList.add("chat-message");
        imageDiv.innerHTML = `<img src="${imageUrl}" alt="Generated Image">`;
        chatBox.appendChild(imageDiv);
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    // Function to append a link to the chatbox
    function appendLink(link) {
        const linkDiv = document.createElement("div");
        linkDiv.classList.add("chat-message");
        linkDiv.innerHTML = `<a href="${link}" target="_blank">View on Unsplash</a>`;
        chatBox.appendChild(linkDiv);
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    // Improved GPT-3 interaction function
    function interactWithGPT3(prompt) {
        const gpt3ApiKey = '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';

        axios.post('https://api.openai.com/v1/engines/davinci/completions', {
            prompt: prompt,
            max_tokens: 50
        }, {
            headers: {
                'Authorization': `Bearer ${gpt3ApiKey}`,
            },
        })
            .then(function (response) {
                if (response.data.choices && response.data.choices.length > 0) {
                    const botResponse = response.data.choices[0].text;
                    appendMessage("AI Chatbot", botResponse);
                } else {
                    appendMessage("AI Chatbot", "I couldn't generate a response. Please try again.");
                }
            })
            .catch(function (error) {
                console.error("Error interacting with GPT-3:", error);
                appendMessage("AI Chatbot", "I encountered an error while interacting with GPT-3.");
            });
    }
});
