// Import functions from info.js
import { saveUserInfo, getUserInfo } from './info.js';

// Function to handle login
document.querySelector("#login-form form").addEventListener("submit", function (e) {
    e.preventDefault();
    const loginEmail = document.getElementById("login-email").value;
    const loginPassword = document.getElementById("login-password").value;

    // Check if the email and password match your stored credentials
    // For simplicity, I'm using a hardcoded email and password.
    if (loginEmail === "your@email.com" && loginPassword === "yourpassword") {
        // Save user information to localStorage
        saveUserInfo(loginEmail, loginPassword);

        // Redirect to price-plans.html
        window.location.href = "price-plans.html";
    } else {
        alert("Invalid email or password. Please try again.");
    }
});

// Function to handle sign-up
document.querySelector("#signup-form form").addEventListener("submit", function (e) {
    e.preventDefault();
    const signupEmail = document.getElementById("signup-email").value;
    const signupPassword = document.getElementById("signup-password").value;

    // Save user information to localStorage
    saveUserInfo(signupEmail, signupPassword);

    // Redirect to price-plans.html
    window.location.href = "price-plans.html";
});
