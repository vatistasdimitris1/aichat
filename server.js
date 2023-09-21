const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

// Middleware to parse JSON request bodies
app.use(bodyParser.json());

// Read the initial user data from 'users.json' or create an empty array
let users = [];
if (fs.existsSync('users.json')) {
    const rawData = fs.readFileSync('users.json');
    users = JSON.parse(rawData);
}

// Function to save email and payment status to users list and info.txt
function saveEmailAndPaymentStatus(email, isPaid) {
    const user = getUserData(email);

    if (user) {
        user.email = email; // Update the user's email
        user.paid = isPaid; // Update the payment status
    } else {
        // If the user does not exist, add a new user
        users.push({ email, paid: isPaid });
    }

    // Save the updated user list to a file (users.json)
    fs.writeFileSync('users.json', JSON.stringify(users, null, 2));

    // Save the updated user list to 'info.txt'
    const userLines = users.map(user => `${user.email},Paid:${user.paid ? 'true' : 'false'}`);
    fs.writeFileSync('info.txt', userLines.join('\n'));
}

// Function to get user data by email
function getUserData(email) {
    return users.find(user => user.email === email);
}

// Route to get the list of users
app.get('/get-users', (req, res) => {
    res.json(users);
});

// Route to handle user signups
app.post('/signup', (req, res) => {
    const { email, isPaid } = req.body;
    saveEmailAndPaymentStatus(email, isPaid);
    res.sendStatus(200); // Send a success status
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
