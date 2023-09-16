document.addEventListener("DOMContentLoaded", function () {
    const nextButton = document.getElementById("next-button");
    const emailInput = document.getElementById("email-input");

    nextButton.addEventListener("click", function () {
        const email = emailInput.value.trim();
        if (isValidEmail(email)) {
            if (isAdminEmail(email)) {
                // Redirect to main.html if the email is the admin's email
                window.location.href = "main.html";
            } else {
                // Handle non-admin user actions or validations
                alert("Welcome non-admin user.");
                // Perform other actions for non-admin users
            }
        } else {
            alert("Invalid email address. Please enter a valid email.");
        }
    });

    // Function to validate an email address
    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    // Function to check if the email is the admin's email
    function isAdminEmail(email) {
        return email === "familyvatistas90@gmail.com"; // Replace with your admin's email
    }
});
