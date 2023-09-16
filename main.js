// Import the getUserData function from info.js
import { getUserData } from './info.js';

document.addEventListener("DOMContentLoaded", function () {
    const nextButton = document.getElementById("next-button");
    const emailInput = document.getElementById("email-input");

    nextButton.addEventListener("click", function () {
        const email = emailInput.value.trim();
        
        if (isValidEmail(email)) {
            const user = getUserData(email);
            
            if (user) {
                if (user.isAdmin) {
                    // Redirect to main.html if the email is the admin's email
                    window.location.href = "main.html";
                } else if (user.hasPaid) {
                    // Redirect to chat.html or any other page for paid users
                    alert("Welcome paid user.");
                    // Perform other actions for paid users
                } else {
                    // Redirect to payment.html for users who haven't paid
                    window.location.href = "pay.html";
                }
            } else {
                // Redirect to payment.html for non-existing users
                window.location.href = "pay.html";
            }
        } else {
            alert("Invalid email address. Please enter a valid email.");
        }
    });

    // Function to validate an email address (you can use a more robust validation method)
    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
});
