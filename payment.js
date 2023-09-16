// payment.js
document.addEventListener("DOMContentLoaded", function () {
    const userEmail = document.getElementById("user-email");
    const paypalButtonContainer = document.getElementById("paypal-button-container");

    // Retrieve user's email from query parameter (assuming you passed it)
    const params = new URLSearchParams(window.location.search);
    const email = params.get("email");

    // Display the user's email
    if (email) {
        userEmail.textContent = email;
    }

    // Initialize PayPal buttons
    paypal.Buttons({
        createOrder: function (data, actions) {
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
        onApprove: function (data, actions) {
            // This function captures the funds from the transaction.
            return actions.order.capture().then(function (details) {
                // After a successful payment, you can save payment status and email to info.js
                const paymentInfo = {
                    email: email, // Use the email from the query parameter
                    paid: true
                };
                // Store paymentInfo in info.js (you need to implement this)
                // Example: info.storePaymentInfo(paymentInfo);

                // Redirect the user to the index page upon successful payment
                window.location.href = "index.html";
            });
        }
    }).render(paypalButtonContainer);
});
