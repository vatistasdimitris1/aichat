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
                // Handle non-existing users
                alert("User not found. Please sign up or check your email.");
            }
        } else {
            alert("Invalid email address. Please enter a valid email.");
        }
    });

    // Function to validate an email address
    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    // Sample user information (replace with your actual user data)
    const users = [
        { email: 'familyvatistas90@gmail.com', isAdmin: true, hasPaid: true },
        { email: 'user2@example.com', isAdmin: false, hasPaid: true },
        { email: 'user3@example.com', isAdmin: false, hasPaid: false },
        // Add more user data as needed
    ];

    // Function to check user credentials and return user data
    function getUserData(email) {
        return users.find(user => user.email === email);
    }
});
