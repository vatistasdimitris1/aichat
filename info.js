// Sample user information (replace with your actual user data)
const users = [
    { email: 'familyvatistas90@gmail.com', hasPaid: true, isAdmin: true }, // Add your email as an admin
    { email: 'user@example.com', hasPaid: true },
    { email: 'user2@example.com', hasPaid: false },
    // Add more user data as needed
];

// Function to check user credentials and return user data
function getUserData(email) {
    return users.find(user => user.email === email);
}

// Function to update the payment status of a user
function updatePaymentStatus(email, hasPaid) {
    const user = getUserData(email);
    if (user) {
        user.hasPaid = hasPaid;
        return true; // Successfully updated payment status
    }
    return false; // User not found
}

// Export the getUserData and updatePaymentStatus functions
module.exports = {
    getUserData,
    updatePaymentStatus,
};
