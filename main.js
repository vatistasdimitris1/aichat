document.addEventListener("DOMContentLoaded", function () {
    const saveEmailButton = document.getElementById("save-email-button");
    const emailInput = document.getElementById("email-input");

    saveEmailButton.addEventListener("click", function () {
        const email = emailInput.value.trim();
        if (isValidEmail(email)) {
            // Save the email to info.js
            saveEmailToInfo(email);
            alert("Email saved successfully.");
        } else {
            alert("Invalid email address. Please enter a valid email.");
        }
    });

    // Function to validate an email address (you can use a more robust validation method)
    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    // Function to save email to info.js (you need to implement this function)
    function saveEmailToInfo(email) {
        // Implement the logic to save the email to info.js
        // For example:
        // info.email = email;
    }
});
