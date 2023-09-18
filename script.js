document.addEventListener("DOMContentLoaded", function () {
    const chatBox = document.getElementById("chat-box");
    const userInput = document.getElementById("user-input");
    const sendButton = document.getElementById("send-button");
    const googleModeButton = document.getElementById("google-mode-button");
    const gpt3ModeButton = document.getElementById("gpt3-mode-button");
    const voiceButton = document.getElementById("voice-button");
    const androidButton = document.getElementById("android-button"); // Added Android button

    let isGoogleModeActive = false;
    let isGpt3ModeActive = false;

    // Check if the screen width is greater than 600px (typical phone width)
    const isMouseTrackingEnabled = window.innerWidth > 600;

    if (isMouseTrackingEnabled) {
        const circularCursor = document.createElement("div");
        let mouseX = 0;
        let mouseY = 0;

        document.addEventListener("mousemove", function (e) {
            mouseX = e.clientX;
            mouseY = e.clientY;

            circularCursor.style.left = mouseX + "px";
            circularCursor.style.top = mouseY + "px";
        });

        chatBox.appendChild(circularCursor);
        circularCursor.classList.add("circular-cursor");
    }

    googleModeButton.addEventListener("click", toggleGoogleMode);
    gpt3ModeButton.addEventListener("click", toggleGpt3Mode);
    sendButton.addEventListener("click", sendMessage);
    voiceButton.addEventListener("click", toggleVoiceRecognition);
    
    // Added event listener for Android button click
    androidButton.addEventListener("click", downloadApk);

    let isListening = false;
    let recognition;

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

                    const googleResponse = `Google says: ${title}. Here's a snippet: ${snippet}`;
                    appendMessage("Google", googleResponse);
                } else {
                    appendMessage("Google", "Sorry, I couldn't find an answer to your question.");
                }
            })
            .catch(function (error) {
                console.error(error);
                appendMessage("Google", "An error occurred while searching.");
            });
    }

    function interactWithGPT3(userMessage) {
        const apiKey = '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';

        axios.post('https://api.openai.com/v1/engines/davinci/completions', {
            prompt: userMessage,
            max_tokens: 50,
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            },
        })
        .then(function (response) {
            const botResponse = response.data.choices[0].text;
            appendMessage("AI Chatbot", botResponse);
        })
        .catch(function (error) {
            console.error(error);
            appendMessage("AI Chatbot", "An error occurred while fetching a response from GPT-3.");
        });
    }

    function showHelpCommands() {
        const helpCommands = [
            "Available commands:",
            "- Type 'help' to display this list of commands.",
            "- Click 'Google Mode' to enable Google search mode.",
            "- Click 'GPT-3 Mode' to enable GPT-3 chat mode.",
            "- Click the microphone button to start/stop voice recognition.",
            "- Type your questions or messages in the input box and press Enter to send.",
        ];

        helpCommands.forEach((command) => {
            appendMessage("AI Chatbot", command);
        });
    }

    // Function to simulate downloading the APK file
    function downloadApk() {
        // Replace 'your-apk-file.apk' with the actual file path
        const apkFilePath = 'AI-Chatbot.apk';

        // Create a temporary anchor element to trigger the download
        const downloadLink = document.createElement('a');
        downloadLink.href = apkFilePath;
        downloadLink.download = 'AI-Chatbot.apk'; // Specify the desired file name
        downloadLink.style.display = 'none';
        document.body.appendChild(downloadLink);

        // Trigger the click event to start the download
        downloadLink.click();

        // Clean up
        document.body.removeChild(downloadLink);
    }

    initSpeechRecognition();
});
