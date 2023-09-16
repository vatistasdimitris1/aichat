document.addEventListener("DOMContentLoaded", function () {
    const nextButton = document.getElementById("next-button");
    const emailInput = document.getElementById("email-input");
    const paymentContainer = document.getElementById("payment-container");
    const userEmail = document.getElementById("user-email");

    nextButton.addEventListener("click", function () {
        const email = emailInput.value.trim();
        if (isValidEmail(email)) {
            // Hide email input and display payment container
            emailInput.style.display = "none";
            nextButton.style.display = "none";
            paymentContainer.style.display = "block";
            userEmail.textContent = email;
        } else {
            // Handle invalid email input
            alert("Invalid email address. Please enter a valid email.");
        }
    });

    // Initialize PayPal buttons
    paypal.Buttons({
        createOrder: function (data, actions) {
            // This function sets up the details of the transaction, including the amount and currency.
            return actions.order.create({
                purchase_units: [{
                    amount: {
                        value: '50.00' // One-time payment amount (adjust as needed)
                    }
                }]
            });
        },
        onApprove: function (data, actions) {
            // This function captures the funds from the transaction.
            return actions.order.capture().then(function (details) {
                // After a successful payment, you can save payment status and email as needed
                const paymentInfo = {
                    email: emailInput.value,
                    paid: true
                };
                // You need to implement the logic to store paymentInfo

                // Redirect the user to the index page upon successful payment
                window.location.href = "index.html";
            });
        }
    }).render('#paypal-button-container');

    // Function to validate an email address (you can use a more robust validation method)
    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
});
