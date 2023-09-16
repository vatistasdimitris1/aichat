document.addEventListener("DOMContentLoaded", function () {
    const nextButton = document.getElementById("next-button");
    const emailInput = document.getElementById("email-input");

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
});
