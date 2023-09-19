// Sample user data (replace with your data)
const users = [
    { email: 'user@example.com', paid: false },
    { email: 'familyvatistas90@gmail.com', paid: true }
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

// Function to get all users
function getUsers() {
    return users;
}

// Function to add a new user
function addUser(newUser) {
    users.push(newUser);
}

// Function to remove a user by email
function removeUser(email) {
    const index = users.findIndex(user => user.email === email);
    if (index !== -1) {
        users.splice(index, 1);
    }
}

export { getUserData, saveEmailAndPaymentStatus, getUsers, addUser, removeUser };
