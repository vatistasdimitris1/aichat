document.addEventListener("DOMContentLoaded", function () {
    const payButton = document.getElementById("pay-button");

    // Event listener for the "Pay" button
    payButton.addEventListener("click", function () {
        // Create an email input and "Next" button
        const emailInput = document.createElement("input");
        emailInput.type = "email";
        emailInput.placeholder = "Enter your email";
        emailInput.id = "email-input";

        const nextButton = document.createElement("button");
        nextButton.textContent = "Next";
        nextButton.id = "next-button";

        // Replace the "Pay" button with the email input and "Next" button
        payButton.parentElement.replaceChild(emailInput, payButton);
        emailInput.insertAdjacentElement("afterend", nextButton);

        // Event listener for the "Next" button
        nextButton.addEventListener("click", function () {
            const userEmail = emailInput.value;
            // You can perform validation on the email here if needed
            if (isValidEmail(userEmail)) {
                // Initialize the PayPal API
                paypal.Buttons({
                    createOrder: function(data, actions) {
                        // This function sets up the details of the transaction, including the amount and currency.
                        return actions.order.create({
                            purchase_units: [{
                                amount: {
                                    value: '50.00' // One-time payment amount (adjust as needed)
                                }
                            }],
                            application_context: {
                                shipping_preference: "NO_SHIPPING" // Specify no shipping for digital goods
                            }
                        });
                    },
                    onApprove: function(data, actions) {
                        // This function captures the funds from the transaction.
                        return actions.order.capture().then(function(details) {
                            // After a successful payment, you can store the email and payment details in info.js
                            const paymentInfo = {
                                email: userEmail,
                                // Add other payment details as needed
                                transactionId: details.id,
                                // Add more details if necessary
                            };
                            // Store paymentInfo in info.js
                            // Example: info.storePaymentInfo(paymentInfo);

                            // Redirect the user to the index page upon successful payment
                            window.location.href = `main.html`;
                        });
                    }
                }).render('#paypal-button-container');
            } else {
                // Handle invalid email input
                alert("Invalid email address. Please enter a valid email.");
            }
        });
    });

    // Function to validate an email address (you can use a more robust validation method)
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
});
