document.addEventListener("DOMContentLoaded", function () {
    paypal.Buttons({
        createOrder: function (data, actions) {
            return actions.order.create({
                purchase_units: [{
                    amount: {
                        value: '50.00' // Adjust the payment amount as needed
                    }
                }]
            });
        },
        onApprove: function (data, actions) {
            // Capture the funds from the transaction
            return actions.order.capture().then(function (details) {
                // Payment successful
                console.log('Transaction completed by ' + details.payer.name.given_name);
                // Redirect to a success page or perform other actions
                window.location.href = "main.html";
            });
        }
    }).render('#paypal-button');
});
