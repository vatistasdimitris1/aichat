// Sample user information (replace with your actual user data)
const users = [
    { email: 'familyvatistas90@gmail.com', isAdmin: true, hasPaid: true },
    { email: 'user2@example.com', isAdmin: false, hasPaid: true },
    // Add more user data as needed
];

// Function to check user credentials and return user data
function getUserData(email) {
    return users.find(user => user.email === email);
}

// Export the getUserData function (you can add more functions as needed)
module.exports = {
    getUserData
};
