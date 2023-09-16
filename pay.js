document.addEventListener("DOMContentLoaded", function () {
    const paypalButton = document.getElementById("paypal-button");

    paypalButton.addEventListener("click", function () {
        // Replace 'YOUR_CLIENT_ID' with your actual PayPal client ID
        const clientId = 'AU_rP43t9nXsK1lrVxTpdoadLM19m4TodwP3O1A2586msFhIMF-bCMYkV2IlE5lXzomty6gWW_v29pNv';
        const amount = '50.00'; // Adjust the payment amount as needed
        const returnUrl = 'https://dimvat1.github.io/aichat/main.html'; // Replace with your success page URL
        const cancelUrl = 'https://dimvat1.github.io/aichat/'; // Replace with your cancel page URL

        // Construct the PayPal payment link
        const paypalLink = `https://www.paypal.com/cgi-bin/webscr?cmd=_xclick&business=${clientId}&item_name=Payment&amount=${amount}&return=${returnUrl}&cancel_return=${cancelUrl}`;

        // Open a new window or modal dialog with the PayPal link
        window.open(paypalLink, 'PayPal Payment', 'width=600,height=400');
    });
});
