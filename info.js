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

module.exports = {
    checkPaymentStatus,
    updatePaymentStatus
};
