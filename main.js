// Import the getUserData function from info.js
import { getUserData } from './info.js';

document.addEventListener("DOMContentLoaded", function () {
    const nextButton = document.getElementById("next-button");
    const emailInput = document.getElementById("email-input");
    const checkPaymentButton = document.getElementById("check-payment-button");

    nextButton.addEventListener("click", function () {
        const email = emailInput.value.trim();

        if (email === adminEmail) {
            // Redirect to index.html for the admin
            window.location.href = "index.html";
        } else {
            // Redirect to pay.html for non-admin users
            window.location.href = "pay.html";
        }
    });

    checkPaymentButton.addEventListener("click", function () {
        const email = emailInput.value.trim();
        const user = getUserData(email);

        if (email === adminEmail) {
            // Redirect to index.html for the admin
            window.location.href = "index.html";
        } else if (user && user.paid) {
            // Redirect to index.html if the user is paid
            window.location.href = "index.html";
        } else {
            // Redirect to pay.html if the user is not paid
            window.location.href = "pay.html";
        }
    });
});

const adminEmail = "familyvatistas90@gmail.com";
