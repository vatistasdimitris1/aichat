// Function to save user information to localStorage
function saveUserInfo(email, password) {
    localStorage.setItem("email", email);
    localStorage.setItem("password", password);
}

// Function to get user information from localStorage
function getUserInfo() {
    const email = localStorage.getItem("email");
    const password = localStorage.getItem("password");
    return { email, password };
}

// Function to handle sign-up
document.querySelector("#signup-form form").addEventListener("submit", function (e) {
    e.preventDefault();
    const signupEmail = document.getElementById("signup-email").value;
    const signupPassword = document.getElementById("signup-password").value;

    // Save user information to localStorage
    saveUserInfo(signupEmail, signupPassword);

    // Clear the sign-up form
    document.getElementById("signup-email").value = "";
    document.getElementById("signup-password").value = "";

    // Show a message to prompt the user to log in
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message");
    messageDiv.textContent = "Account created! Please log in.";
    document.querySelector(".buttons").appendChild(messageDiv);

    // Hide the sign-up form
    document.getElementById("signup-form").classList.add("hidden");
});

// Function to display the login form when the "Login" button is clicked
document.getElementById("login-button").addEventListener("click", function () {
    // Hide the message
    const messageDiv = document.querySelector(".message");
    if (messageDiv) {
        messageDiv.style.display = "none";
    }

    // Show the login form
    document.getElementById("login-form").classList.remove("hidden");
});
