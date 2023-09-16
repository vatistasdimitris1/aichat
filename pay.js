document.addEventListener("DOMContentLoaded", function () {
    // Replace 'YOUR_CLIENT_ID' with your actual PayPal client ID
    paypal.Buttons({
        createOrder: function (data, actions) {
            return actions.order.create({
                purchase_units: [
                    {
                        amount: {
                            value: '50.00', // Adjust the payment amount as needed
                        },
                    },
                ],
            });
        },
        onApprove: function (data, actions) {
            return actions.order.capture().then(function (details) {
                // Payment was successful
                alert("Payment completed successfully!");
                // Save email and payment status to info.js
                saveEmailAndPaymentToInfo(details.payer.email_address, true);
                // Save email and payment status to info.txt
                saveEmailAndPaymentToTxt(details.payer.email_address, true);
                // Redirect to main.html
                window.location.href = "main.html";
            });
        },
        onCancel: function (data) {
            // Payment was canceled by the user
            alert("Payment was canceled by the user.");
            // Save email and payment status to info.js
            saveEmailAndPaymentToInfo(data.order.payer.email_address, false);
            // Save email and payment status to info.txt
            saveEmailAndPaymentToTxt(data.order.payer.email_address, false);
            // Redirect to index.html
            window.location.href = "index.html";
        },
    }).render("#paypal-button-container");

    function saveEmailAndPaymentToInfo(email, isPaid) {
        // Add your code to save email and payment status to info.js
        // For example:
        // info.email = email;
        // info.paid = isPaid;
    }

    function saveEmailAndPaymentToTxt(email, isPaid) {
        // Add your code to save email and payment status to info.txt
        // For example, you can use JavaScript to write to a text file on the server-side.
    }
});
