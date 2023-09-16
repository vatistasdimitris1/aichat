// Sample user information (replace with your actual user data)
const users = [
    { email: 'familyvatistas90@gmail.com', isAdmin: true, hasPaid: false }, // Admin user
    { email: 'user@example.com', isAdmin: false, hasPaid: true },
    { email: 'user2@example.com', isAdmin: false, hasPaid: false },
    // Add more user data as needed
];

// Function to check user credentials and return user data
export function getUserData(email) {
    return users.find(user => user.email === email);
}
