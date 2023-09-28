document.addEventListener("DOMContentLoaded", function () {
  // DOM elements
  const chatBox = document.getElementById("chat-box");
  const userInput = document.getElementById("user-input");
  const sendButton = document.getElementById("send-button");
  const googleModeButton = document.getElementById("google-mode-button");
  const gpt3ModeButton = document.getElementById("gpt3-mode-button");
  const voiceButton = document.getElementById("voice-button");
  const androidButton = document.getElementById("android-button");
  const generateImageButton = document.getElementById("generate-image-button");

  // Chat modes and voice recognition variables
  let isGoogleModeActive = false;
  let isGpt3ModeActive = false;
  let isListening = false;
  let recognition;

  // Initialize Unsplash API keys
  const unsplashApiKeys = [
    "6lockMXxpnmP6tUBLyLNwl0OM-3jOjP1USUEDHVYyAA",
    "rUJtjSVD6hIScs9DOdosw36v5J7qTdzHc8yQv2V7iOk",
    // Add more API keys here
  ];
  let currentApiKeyIndex = 0;

  // Function to get the next available API key and cycle through them
  function getNextUnsplashApiKey() {
    const apiKey = unsplashApiKeys[currentApiKeyIndex];
    currentApiKeyIndex = (currentApiKeyIndex + 1) % unsplashApiKeys.length;
    return apiKey;
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

  // Function to toggle voice recognition
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

  // Function to send a user message
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

  // Function to update button state (active/inactive)
  function updateButtonState(button, isActive) {
    if (isActive) {
      button.textContent = button.textContent.split(" ")[0] + " (Active)";
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

  // Function to generate a chatbot response
  function chatbotResponse(userMessage) {
    const lowerCaseMessage = userMessage.toLowerCase();
    const responses = {
      hello: "Hello! How can I assist you?",
      hey: "Hello! How can I assist you?",
      "how are you": "I'm just a computer program, but I'm here to help!",
      "what is your name": "I'm your AI chatbot. You can call me Jarvis.",
      bye: "Goodbye! If you have more questions, feel free to ask.",
      default: "I'm not sure I understand. Can you please rephrase your question?",
    };

    for (const keyword in responses) {
      if (lowerCaseMessage.includes(keyword)) {
        return responses[keyword];
      }
    }

    return responses.default;
  }

  // Function to fetch answers from Google
  function fetchAnswersFromGoogle(query) {
    const googleApiKey = "AIzaSyDPVqP6l-NdTAJ1Zg5oKFiLORz-M5tDZvE";
    const googleEngineId = "e66093057c55d4a1d";

    axios
      .get(
        `https://www.googleapis.com/customsearch/v1?key=${googleApiKey}&cx=${googleEngineId}&q=${query}`
      )
      .then(function (response) {
        const searchResults = response.data.items;

        if (searchResults && searchResults.length > 0) {
          const topResult = searchResults[0];
          appendMessage("Google", topResult.title);
          appendMessage("Google", topResult.link);
        } else {
          appendMessage("Google", "No results found.");
        }
      })
      .catch(function (error) {
        console.error("Error fetching data from Google:", error);
        appendMessage("Google", "An error occurred while fetching data.");
      });
  }

  // Function to initialize speech recognition
  function initSpeechRecognition() {
    recognition = new webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;

    recognition.onstart = function () {
      isListening = true;
      updateButtonState(voiceButton, true);
    };

    recognition.onend = function () {
      isListening = false;
      updateButtonState(voiceButton, false);
    };

    recognition.onresult = function (event) {
      const result = event.results[event.results.length - 1];
      const spokenText = result[0].transcript;
      appendMessage("You (Voice)", spokenText);
      sendMessage();
    };
  }

  // Function to interact with GPT-3
  function interactWithGPT3(prompt) {
    // Replace with your GPT-3 API call
    const apiKey = 'YOUR_GPT3_API_KEY'; // Replace with your actual GPT-3 API key
    const apiUrl = 'https://api.openai.com/v1/engines/davinci/completions'; // Adjust the API URL based on your GPT-3 plan

    // Define the data to send to the API
    const requestData = {
      prompt: prompt,
      max_tokens: 50, // Adjust as needed
    };

    // Make an HTTP POST request to the GPT-3 API
    axios
      .post(apiUrl, requestData, {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      })
      .then(function (response) {
        const botResponse = response.data.choices[0].text;
        appendMessage('GPT-3', botResponse);
      })
      .catch(function (error) {
        console.error('Error interacting with GPT-3:', error);
        appendMessage('GPT-3', 'An error occurred while fetching the response.');
      });
  }

  // Function to show help commands
  function showHelpCommands() {
    const helpCommands = [
      "1. Type a message and click 'Send' to chat with the AI chatbot.",
      "2. Use 'Toggle Google Mode' to switch to Google search mode.",
      "3. Use 'Toggle GPT-3 Mode' to switch to GPT-3 response mode (coming soon).",
      "4. Use 'Voice' to enable voice recognition and speak to the chatbot.",
      "5. Use 'Generate Image' to fetch an image related to your message.",
      "6. Use 'Download Android App' to download our Android app.",
    ];
    helpCommands.forEach((command) => appendMessage("Commands", command));
  }

  // Event listeners
  sendButton.addEventListener("click", sendMessage);
  googleModeButton.addEventListener("click", toggleGoogleMode);
  gpt3ModeButton.addEventListener("click", toggleGpt3Mode);
  voiceButton.addEventListener("click", toggleVoiceRecognition);
  androidButton.addEventListener("click", () => {
    window.open("https://your-android-app-link.com", "_blank");
  });
  generateImageButton.addEventListener("click", () => {
    const userMessage = userInput.value.trim();
    if (userMessage !== "") {
      const apiKey = getNextUnsplashApiKey();
      fetchUnsplashImage(userMessage, apiKey)
        .then((imageUrl) => appendImage("Unsplash", imageUrl))
        .catch((error) => {
          console.error("Error fetching Unsplash image:", error);
          appendMessage("Unsplash", "An error occurred while fetching the image.");
        });
    }
  });

  // Function to fetch an image from Unsplash
  function fetchUnsplashImage(query, apiKey) {
    return new Promise(function (resolve, reject) {
      const apiUrl = `https://api.unsplash.com/photos/random?query=${query}&client_id=${apiKey}`;
      axios
        .get(apiUrl)
        .then(function (response) {
          const imageUrl = response.data.urls.regular;
          resolve(imageUrl);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }

  // Function to append an image to the chat box
  function appendImage(sender, imageUrl) {
    const imageElement = document.createElement("img");
    imageElement.src = imageUrl;
    imageElement.alt = "Image from Unsplash";
    appendMessage(sender, imageElement.outerHTML);
  }

  // Initial message from the AI chatbot
  appendMessage("AI Chatbot", "Hello! How can I assist you?");
});
