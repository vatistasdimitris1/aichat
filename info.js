// Sample user information (replace with your actual user data)
const users = [
    { email: 'user@example.com', paid: true },
    { email: 'user2@example.com', paid: false },
    // Add more user data as needed
];

// Function to check user payment status and return user data
function getUserData(email) {
    return users.find(user => user.email === email);
}

// Export the getUserData function (you can add more functions as needed)
export { getUserData };
