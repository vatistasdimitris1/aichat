const users = [
    { email: 'user@example.com', paid: true },
    { email: 'user2@example.com', paid: false },
    // Add more user data as needed
];

function getUserData(email) {
    return users.find(user => user.email === email);
}

export { getUserData };
