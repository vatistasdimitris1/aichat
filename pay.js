import { saveEmailAndPaymentStatus } from './info.js';

document.addEventListener("DOMContentLoaded", function () {
    const userEmailInput = document.getElementById("user-email");
    const payButton = document.getElementById("pay-button");

    paypal.Buttons({
        createOrder: function (data, actions) {
            return actions.order.create({
                purchase_units: [{
                    amount: {
                        value: '50.00'
                    }
                }]
            });
        },
        onApprove: function (data, actions) {
            return actions.order.capture().then(function (details) {
                const userEmail = userEmailInput.value.trim();
                saveEmailAndPaymentStatus(userEmail, true);

                window.location.href = "main.html";
            });
        }
    }).render('#paypal-button-container');
});
