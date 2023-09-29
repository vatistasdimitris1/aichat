document.addEventListener("DOMContentLoaded", function () {
  const chatBox = document.getElementById("chat-box");
  const userInput = document.getElementById("user-input");
  const sendButton = document.getElementById("send-button");
  const googleModeButton = document.getElementById("google-mode-button");
  const voiceButton = document.getElementById("voice-button");
  const androidButton = document.getElementById("android-button");
  const generateImageButton = document.getElementById("generate-image-button");
  const wikipediaButton = document.getElementById("wikipedia-button");

  let isGoogleModeActive = false;
  let isListening = false;
  let recognition;

  const voiceButtonIcons = ["🎙️", "🔴"];

  const unsplashApiKeys = [
    "6lockMXxpnmP6tUBLyLNwl0OM-3jOjP1USUEDHVYyAA",
    // Define your Unsplash API keys here
  ];

  let currentApiKeyIndex = 0;

  function getNextUnsplashApiKey() {
    const apiKeyData = unsplashApiKeys[currentApiKeyIndex];
    currentApiKeyIndex = (currentApiKeyIndex + 1) % unsplashApiKeys.length;
    apiKeyData.usageCount++;
    return apiKeyData.key;
  }

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

  function sendMessage() {
    const userMessage = userInput.value.trim();

    if (userMessage !== "") {
      appendMessage("You", userMessage);

      if (isGoogleModeActive) {
        fetchAnswersFromGoogle(userMessage);
      } else {
        fetchAnswersFromWikipedia(userMessage);
      }

      userInput.value = "";
    }
  }

  function updateButtonState(button, isActive) {
    if (isActive) {
      button.textContent = button.textContent.split(" ")[0];
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

  function initSpeechRecognition() {
    recognition = new webkitSpeechRecognition() || new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      isListening = true;
      voiceButton.innerHTML = voiceButtonIcons[1];
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
      voiceButton.innerHTML = voiceButtonIcons[0];
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
    const apiKey = getNextUnsplashApiKey();

    axios.get(`https://api.unsplash.com/photos/random?client_id=${apiKey}&query=nature`)
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

  userInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();

      const userMessage = userInput.value.trim();
      if (userMessage !== "") {
        appendMessage("You", userMessage);
        sendMessage();
        userInput.value = "";
      }
    }
  });

  googleModeButton.addEventListener("click", toggleGoogleMode);
  voiceButton.addEventListener("click", toggleVoiceRecognition);
  androidButton.addEventListener("click", downloadApk);
  generateImageButton.addEventListener("click", generateImage);
  wikipediaButton.addEventListener("click", showWikipedia);
});

// Function to handle the Android app download
function downloadApk() {
  // Specify the path to your Android app's APK file
  const androidAppFilePath = 'AI-Chatbot.apk';

  // Create a full URL by combining the current page's origin with the file path
  const androidAppDownloadLink = window.location.origin + androidAppFilePath;

  // Create an anchor element to trigger the download
  const downloadLink = document.createElement('a');
  downloadLink.href = androidAppDownloadLink;
  downloadLink.download = 'AI-Chatbot.apk'; // Specify the file name

  // Trigger the click event to initiate the download
  downloadLink.click();

  // Optionally, you can show a message in the chat box
  appendMessage("AI Chatbot", "Downloading the Android app...");

  // Remove the anchor element from the DOM (optional)
  downloadLink.remove();
}
