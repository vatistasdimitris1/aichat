// Sample user information (replace with your actual user data)
const users = [
    { email: 'user@example.com', password: 'password', paid: true },
    { email: 'user2@example.com', password: 'password2', paid: false },
    // Add more user data as needed
];

// Function to check user credentials and return user data
function getUserData(email, password) {
    return users.find(user => user.email === email && user.password === password);
}

// Export the getUserData function (you can add more functions as needed)
module.exports = {
    getUserData
};
