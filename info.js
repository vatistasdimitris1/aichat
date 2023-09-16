// Sample user information (replace with your actual user data)
const users = [
    { email: 'user@example.com', paid: true },
    { email: 'user2@example.com', paid: false },
    // Add more user data as needed
];

// Sample payment information (to store payment details)
const payments = [];

// Function to check if a user has made a payment
function hasPaid(email) {
    return users.find(user => user.email === email)?.paid || false;
}

// Function to store payment information
function storePaymentInfo(paymentInfo) {
    payments.push(paymentInfo);
}

// Function to retrieve payment information for a user
function getUserPayments(email) {
    return payments.filter(payment => payment.email === email);
}

// Export the hasPaid, storePaymentInfo, and getUserPayments functions
module.exports = {
    hasPaid,
    storePaymentInfo,
    getUserPayments
};
