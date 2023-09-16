// Sample user information (replace with your actual user data)
const users = [
    { email: 'user@example.com', hasPaid: true },
    { email: 'user2@example.com', hasPaid: false },
    // Add more user data as needed
];

// Function to check user payment status and return a boolean
function checkPaymentStatus(email) {
    const user = users.find(user => user.email === email);
    return user ? user.hasPaid : false;
}

// Function to update user payment status
function updatePaymentStatus(email, hasPaid) {
    const userIndex = users.findIndex(user => user.email === email);
    if (userIndex !== -1) {
        users[userIndex].hasPaid = hasPaid;
    }
}

const info = require('./info.js'); // Import your info.js module

// Update the payment status for a specific email
info.updatePaymentStatus('familyvatistas90@gmail.com', true); // Set 'user@example.com' as paid


// After a successful payment
updatePaymentStatus(email, true); // Mark the user as paid
 
module.exports = {
    checkPaymentStatus,
    updatePaymentStatus
};
