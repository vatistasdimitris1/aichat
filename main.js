document.addEventListener("DOMContentLoaded", function () {
    const nextButton = document.getElementById("next-button");
    const emailInput = document.getElementById("email-input");

    nextButton.addEventListener("click", function () {
        const email = emailInput.value.trim();
        if (isValidEmail(email)) {
            // Check payment status using info.js
            const hasPaid = checkPaymentStatus(email);

            if (hasPaid) {
                alert("You have already paid. You can enter the chat.");
                // Redirect to the chat.html page or any other action you want
                window.location.href = "chat.html"; // Replace with the desired URL
            } else {
                alert("You have not paid yet. Please make a payment.");
                // Redirect to the payment page or any other action you want
                window.location.href = "payment.html"; // Replace with the desired URL
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
