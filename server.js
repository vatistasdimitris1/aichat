const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Serve static files (HTML, CSS, JS)
app.use(express.static('public'));

// Sample user data (replace with your data)
const users = [
    { email: 'user@example.com', paid: false },
    { email: 'familyvatistas90@gmail.com', paid: true },
    { email: 'DimVat', paid: true }
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

// Route to get users
app.get('/get-users', (req, res) => {
    res.json(getUsers());
});

// Route to save user data
app.post('/save-data', (req, res) => {
    const { email, isPaid } = req.body;

    // Save data to info.js
    saveEmailAndPaymentStatus(email, isPaid);

    // Optionally, save data to info.txt
    const userData = `${email} (Paid: ${isPaid ? 'Yes' : 'No'})\n`;
    fs.appendFile('info.txt', userData, (err) => {
        if (err) {
            console.error('Error saving data to info.txt:', err);
        }
    });

    res.sendStatus(200);
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
