document.addEventListener("DOMContentLoaded", function () {
    const chatBox = document.getElementById("chat-box");
    const userInput = document.getElementById("user-input");
    const sendButton = document.getElementById("send-button");
    const googleModeButton = document.getElementById("google-mode-button");
    const gpt3ModeButton = document.getElementById("gpt3-mode-button");
    const voiceButton = document.getElementById("voice-button");

       let isGoogleModeActive = false;
    let isGpt3ModeActive = false;
    let isListening = false;
    let isPartyMode = false; // Flag to track party mode

    const helpButton = document.getElementById("help-button");
    const commandList = document.getElementById("command-list");

    helpButton.addEventListener("click", showHelpCommands);

    function showHelpCommands() {
        // Toggle the display of the command list
        if (commandList.style.display === "none" || commandList.style.display === "") {
            commandList.style.display = "block";
        } else {
            commandList.style.display = "none";
        }
    }
    
 let isGoogleModeActive = false;
    let isGpt3ModeActive = false;
    let isListening = false;
    let isPartyMode = false; // Flag to track party mode

    const colors = [
        "#FF5733", // Red
        "#E8AEB7", // Pink
        "#B8E1FF", // Light Blue
        "#ffc107", // Yellow
        "#9AFB85", // Light Green
    ];

    // Add this function to generate random background colors
    function generateRandomColor() {
        const randomIndex = Math.floor(Math.random() * colors.length);
        return colors[randomIndex];
    }

    // Add event listener for the user input
    userInput.addEventListener("keydown", function (e) {
        if (e.key === "Enter") {
            const userMessage = userInput.value.trim();

            if (userMessage !== "") {
                if (userMessage.toLowerCase() === "party") {
                    isPartyMode = true;
                    chatBox.style.transition = "background-color 1s"; // Smooth transition
                    startPartyMode();
                } else if (userMessage.toLowerCase() === "stop") {
                    isPartyMode = false;
                    chatBox.style.transition = "background-color 1s"; // Smooth transition
                    stopPartyMode();
                } else {
                    sendMessage(userMessage);
                }

                userInput.value = "";
            }
        }
    });

    // Modify the sendMessage function to include message sender
    function sendMessage(message) {
        appendMessage("You", message);

        if (isGoogleModeActive) {
            fetchAnswersFromGoogle(message);
        } else if (isGpt3ModeActive) {
            interactWithGPT3(message);
        } else {
            const botResponse = chatbotResponse(message);
            appendMessage("AI Chatbot", botResponse);
        }
    }

function startPartyMode() {
    chatBox.classList.add("party-mode"); // Add the party-mode class
}

function stopPartyMode() {
    chatBox.classList.remove("party-mode"); // Remove the party-mode class
}

    


    // Add this to your existing JavaScript code
const resetButton = document.getElementById("reset-button");

resetButton.addEventListener("click", function () {
    // Clear the chat box when the reset button is clicked
    chatBox.innerHTML = '';
});

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

    googleModeButton.addEventListener("click", function () {
        isGoogleModeActive = !isGoogleModeActive;
        toggleGoogleMode(isGoogleModeActive);
    });

    gpt3ModeButton.addEventListener("click", function () {
        isGpt3ModeActive = !isGpt3ModeActive;
        toggleGpt3Mode(isGpt3ModeActive);
    });

    sendButton.addEventListener("click", sendMessage);

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
    const helpMessage = document.createElement("div");
    helpMessage.classList.add("help-message");
    helpMessage.textContent = "Available commands:\n\n" +
        "- Type 'help' to display this list of commands.\n" +
        "- Click 'Google Mode' to enable Google search mode.\n" +
        "- Click 'GPT-3 Mode' to enable GPT-3 chat mode.\n" +
        "- Click the microphone button to start/stop voice recognition.\n" +
        "- Type your questions or messages in the input box and press Enter to send.";

    chatBox.appendChild(helpMessage);

    // Automatically hide the help message after 10-20 seconds
    setTimeout(function () {
        chatBox.removeChild(helpMessage);
    }, Math.floor(Math.random() * 10000) + 10000); // Random timeout between 10-20 seconds
}

userInput.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
        const userMessage = userInput.value.trim();
        if (userMessage.toLowerCase() === "help") {
            showHelpCommands();
        } else {
            sendMessage();
        }
    }
    
});
