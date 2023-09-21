import { getUserData, saveEmailAndPaymentStatus } from './info.js';

document.addEventListener("DOMContentLoaded", function () {
    const nextButton = document.getElementById("next-button");
    const emailInput = document.getElementById("email-input");
    const checkPaymentButton = document.getElementById("check-payment-button");

    nextButton.addEventListener("click", function () {
        const email = emailInput.value.trim();
        // Redirect to pay.html and pass the email as a query parameter
        window.location.href = `pay.html?email=${email}`;
    });

    checkPaymentButton.addEventListener("click", function () {
        const email = emailInput.value.trim();
        const user = getUserData(email);
        if (user && user.paid) {
            // Redirect back to main.html
            window.location.href = "main.html";
        } else {
            alert("You have not paid yet. Please make a payment.");
            // Redirect to the payment page or any other action you want
            window.location.href = "pay.html";
        }
    });
});
