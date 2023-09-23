document.addEventListener("DOMContentLoaded", function () {
    const chatBox = document.getElementById("chat-box");
    const userInput = document.getElementById("user-input");
    const sendButton = document.getElementById("send-button");
    const googleModeButton = document.getElementById("google-mode-button");
    const gpt3ModeButton = document.getElementById("gpt3-mode-button");
    const voiceButton = document.getElementById("voice-button");
    const androidButton = document.getElementById("android-button");
    const cursor = document.getElementById("cursor");

    let isGoogleModeActive = false;
    let isGpt3ModeActive = false;
    let isListening = false;
    let recognition;

    const voiceButtonIcons = ["🎙️", "🔴"];

    const isMouseTrackingEnabled = window.innerWidth > 600;

    if (isMouseTrackingEnabled) {
        document.addEventListener("mousemove", function (e) {
            const mouseX = e.clientX;
            const mouseY = e.clientY;

            cursor.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
        });
    }

    googleModeButton.addEventListener("click", toggleGoogleMode);
    gpt3ModeButton.addEventListener("click", toggleGpt3Mode);
    sendButton.addEventListener("click", sendMessage);
    voiceButton.addEventListener("click", toggleVoiceRecognition);
    androidButton.addEventListener("click", downloadApk);

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

    function initSpeechRecognition() {
        recognition = new webkitSpeechRecognition() || new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onstart = function () {
            isListening = true;
            voiceButton.innerHTML = voiceButtonIcons[1];
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
            voiceButton.innerHTML = voiceButtonIcons[0];
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

    function interactWithGPT3(prompt) {
        // Replace with your OpenAI GPT-3 API key
        const gpt3ApiKey = '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';

        // Define the request data for GPT-3
        const requestData = {
            prompt: prompt,
            max_tokens: 50  // You can adjust the `max_tokens` as needed
        };

        // Make a POST request to interact with GPT-3
        fetch('https://api.openai.com/v1/engines/davinci/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${gpt3ApiKey}`
            },
            body: JSON.stringify(requestData)
        })
        .then((response) => response.json())
        .then((data) => {
            if (data.choices && data.choices.length > 0) {
                const botResponse = data.choices[0].text;
                appendMessage("AI Chatbot", botResponse);
            } else {
                appendMessage("AI Chatbot", "I couldn't generate a response. Please try again.");
            }
        })
        .catch((error) => {
            console.error("Error interacting with GPT-3:", error);
            appendMessage("AI Chatbot", "I encountered an error while interacting with GPT-3.");
        });
    }
});
