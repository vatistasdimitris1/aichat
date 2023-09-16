// main.js
document.addEventListener("DOMContentLoaded", function () {
    const nextButton = document.getElementById("next-button");
    const emailInput = document.getElementById("email-input");

    nextButton.addEventListener("click", function () {
        const email = emailInput.value.trim();
        if (isValidEmail(email)) {
            // Redirect to payment.html with email as a query parameter
            window.location.href = `payment.html?email=${encodeURIComponent(email)}`;
        } else {
            // Handle invalid email input
            alert("Invalid email address. Please enter a valid email.");
        }
    });

    // Function to validate an email address (you can use a more robust validation method)
    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
});
