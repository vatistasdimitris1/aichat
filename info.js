// Sample user data (replace with your data)
const users = [
    { email: 'user@example.com', paid: false },
    // Add more user data as needed
];

// Function to get user data by email
function getUserData(email) {
    return users.find(user => user.email === email);
}

// Function to save email and payment status to info.js
function saveEmailAndPaymentStatus(email, isPaid) {
    const user = getUserData(email);

    if (user) {
        user.email = email; // Update the user's email
        user.paid = isPaid; // Update the payment status
    }
}

export { getUserData, saveEmailAndPaymentStatus };
