document.addEventListener("DOMContentLoaded", function () {
    const nextButton = document.getElementById("next-button");
    const emailInput = document.getElementById("email-input");
    const checkPaymentButton = document.getElementById("check-payment-button");

    nextButton.addEventListener("click", function () {
        const email = emailInput.value.trim();
        if (isValidEmail(email)) {
            // Save the email to info.js (you need to implement this)
            saveEmailToInfo(email);
            // Redirect to the pay.html page
            window.location.href = "pay.html";
        } else {
            alert("Invalid email address. Please enter a valid email.");
        }
    });

    checkPaymentButton.addEventListener("click", function () {
        const email = emailInput.value.trim();
        const isPaid = checkPaymentStatus(email);
        if (isPaid) {
            alert("You have already paid. You can enter the chat.");
            // Redirect to the chat.html page or any other action you want
        } else {
            alert("You have not paid yet. Please make a payment.");
            // Redirect to the payment page or any other action you want
        }
    });

    // Function to validate an email address (you can use a more robust validation method)
    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    // Function to save email to info.js (you need to implement this)
    function saveEmailToInfo(email) {
        // Implement the logic to save the email to info.js
        // For example:
        // info.email = email;
    }

    // Function to check payment status in info.js (you need to implement this)
    function checkPaymentStatus(email) {
        // Implement the logic to check the payment status in info.js
        // For example:
        // const user = getUserData(email);
        // return user && user.paid;
    }
});
