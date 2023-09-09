document.addEventListener("DOMContentLoaded", function () {
    const chatBox = document.getElementById("chat-box");
    const messageForm = document.getElementById("message-form");
    const userInput = document.getElementById("user-input");
    const googleModeButton = document.getElementById("google-mode-button");
    const gpt3ModeButton = document.getElementById("gpt3-mode-button");
    const voiceButton = document.getElementById("voice-button");
    const resetButton = document.getElementById("reset-button");
    const commandList = document.getElementById("command-list");
 const chatbotButton = document.getElementById("chatbot-button");
    // Initialize a counter to track the number of clicks on the "Chatbot" text
    let chatbotClickCount = 0;

    // Handle a click on the "Chatbot" text
    chatbotButton.addEventListener("click", function () {
        chatbotClickCount++;
        
        if (chatbotClickCount === 3) {
            // When clicked three times, perform a special action
            specialAction();
            chatbotClickCount = 0; // Reset the counter
        } else {
            // Send a message when the "Chatbot" text is clicked once or twice
            sendChatbotMessage();
        }
    });

    function specialAction() {
        // Perform your special action here
        appendMessage("AI Chatbot", "You found it! Clicked 3 times on the secret button!");
    }
    let isGoogleModeActive = false;
    let isGpt3ModeActive = false;
    let isListening = false;

    resetButton.addEventListener("click", function () {
        // Clear the chat box when the reset button is clicked
        chatBox.innerHTML = "";
    });

    googleModeButton.addEventListener("click", function () {
        isGoogleModeActive = !isGoogleModeActive;
        toggleGoogleMode(isGoogleModeActive);
    });

    gpt3ModeButton.addEventListener("click", function () {
        isGpt3ModeActive = !isGpt3ModeActive;
        toggleGpt3Mode(isGpt3ModeActive);
    });

    // Handle form submission to send a message
    messageForm.addEventListener("submit", function (e) {
        e.preventDefault(); // Prevent the default form submission behavior
        sendMessage();
    });

    function toggleVoiceRecognition() {
        if (isListening) {
            isListening = false;
            voiceButton.textContent = "🎙️"; // Change button text back to microphone icon
        } else {
            isListening = true;
            voiceButton.textContent = "🔴"; // Change button text to indicate listening
            startListening();
        }
    }

    voiceButton.addEventListener("click", toggleVoiceRecognition);

    let recognition;

    function startListening() {
        if (!("webkitSpeechRecognition" in window)) {
            console.error("Speech recognition is not supported in this browser.");
            return;
        }

        recognition = new webkitSpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = "en-US";

        recognition.onresult = function (event) {
            const result = event.results[event.results.length - 1][0].transcript;
            userInput.value = result;
        };

        recognition.start();
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

    function sendMessage() {
        const userMessage = userInput.value.trim();

        if (userMessage !== "") {
            appendMessage("You", userMessage);

            if (isGoogleModeActive) {
                fetchAnswersFromGoogle(userMessage);
            } else if (isGpt3ModeActive) {
                interactWithGPT3(userMessage);
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

    // Command to show/hide the command list
    document.addEventListener("keydown", function (e) {
        if (e.key.toLowerCase() === "h" && e.ctrlKey) {
            toggleCommandList();
        }
    });

    function toggleCommandList() {
        if (commandList.style.display === "none" || commandList.style.display === "") {
            commandList.style.display = "block";
            setTimeout(() => {
                commandList.style.display = "none";
            }, 10000); // Hide after 10 seconds
        } else {
            commandList.style.display = "none";
        }

            // Handle the secret button click event
    secretButton.addEventListener("click", function () {
        toggleSecretMode();
    });

    function toggleSecretMode() {
        isSecretModeActive = !isSecretModeActive;
        if (isSecretModeActive) {
            // Perform your secret action here
            alert("You've activated the secret mode!");
        }
    }
});
