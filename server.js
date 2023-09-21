const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Serve static files (HTML, CSS, JavaScript)
app.use(express.static('public'));

// Sample user data (replace with your data)
let users = [
    { email: 'user@example.com', paid: false },
    { email: 'familyvatistas90@gmail.com', paid: true },
];

// Get all users
app.get('/get-users', (req, res) => {
    res.json(users);
});

// Add a new user
app.post('/add-user', (
