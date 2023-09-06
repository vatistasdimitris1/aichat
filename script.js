document.addEventListener("DOMContentLoaded", function () {
    // DOM elements
    const chatBox = document.getElementById("chat-box");
    const userInput = document.getElementById("user-input");
    const sendButton = document.getElementById("send-button");
    const googleModeButton = document.getElementById("google-mode-button");
    const gpt3ModeButton = document.getElementById("gpt3-mode-button");
    const voiceButton = document.getElementById("voice-button");

    // Voice recognition setup
    const recognition = new webkitSpeechRecognition();
    let isListening = false;

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onstart = function () {
        isListening = true;
        toggleVoiceButton(true);
    };

    recognition.onend = function () {
        isListening = false;
        toggleVoiceButton(false);
    };

    recognition.onresult = function (event) {
        const result = event.results[event.results.length - 1][0].transcript;
        userInput.value = result;
        sendMessage();
    };

    // Event listeners
    googleModeButton.addEventListener("click", toggleGoogleMode);
    gpt3ModeButton.addEventListener("click", toggleGpt3Mode);
    sendButton.addEventListener("click", sendMessage);
    voiceButton.addEventListener("click", toggleVoiceRecognition);
    userInput.addEventListener("keydown", function (e) {
        if (e.key === "Enter") {
            sendMessage();
        }
    });

    // Functions
    function toggleGoogleMode() {
        isGoogleModeActive = !isGoogleModeActive;
        toggleButtonClass(googleModeButton, isGoogleModeActive);
    }

    function toggleGpt3Mode() {
        isGpt3ModeActive = !isGpt3ModeActive;
        toggleButtonClass(gpt3ModeButton, isGpt3ModeActive);
    }

    function toggleVoiceButton(isActive) {
        if (isActive) {
            voiceButton.textContent = "🔴"; // Listening
        } else {
            voiceButton.textContent = "🎙️"; // Microphone
        }
    }

    function toggleVoiceRecognition() {
        if (isListening) {
            recognition.stop();
        } else {
            recognition.start();
        }
    }

    function toggleButtonClass(button, isActive) {
        if (isActive) {
            button.classList.add("active");
        } else {
            button.classList.remove("active");
        }
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

    function appendMessage(sender, message) {
        const messageDiv = document.createElement("div");
        messageDiv.classList.add("chat-message");
        messageDiv.innerHTML = `<strong>${sender}:</strong> ${message}`;
        chatBox.appendChild(messageDiv);
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    function toggleGoogleMode(isActive) {
        if (isActive) {
            googleModeButton.textContent = "Google Mode (Active)";
            googleModeButton.classList.add("active");
        } else {
            googleModeButton.textContent = "Google";
            googleModeButton.classList.remove("active");
        }
    }

    function toggleGpt3Mode(isActive) {
        if (isActive) {
            gpt3ModeButton.textContent = "GPT-3 Mode (Active)";
            gpt3ModeButton.classList.add("active");
        } else {
            gpt3ModeButton.textContent = "GPT-3";
            gpt3ModeButton.classList.remove("active");
        }
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

});
