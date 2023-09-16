paypal.Buttons({
    createOrder: function(data, actions) {
        // This function sets up the details of the transaction, including the amount and currency.
        return actions.order.create({
            purchase_units: [{
                amount: {
                    value: '50.00' // One-time payment amount (adjust as needed)
                }
            }]
        });
    },
    onApprove: function(data, actions) {
        // This function captures the funds from the transaction.
        return actions.order.capture().then(function(details) {
            // After a successful payment, you can redirect the user to another page.
            alert('Transaction completed by ' + details.payer.name.given_name);
            // Save email and payment status to info.js (you need to implement this)
            // Redirect to the index.html page
            window.location.href = "main.html";
        });
    }
}).render('#paypal-button-container');
