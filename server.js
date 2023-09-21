const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 3000;

// Import functions from info.js
const { getUserData, saveEmailAndPaymentStatus, getUsers, addUser, removeUser } = require('./info');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static files
app.use(express.static('public'));

// Route to get all users
app.get("/get-users", (req, res) => {
    const usersData = getUsers();
    res.json(usersData);
});

// Route to add a new user
app.post("/add-user", (req, res) => {
    const { email, paid } = req.body;
    addUser({ email, paid });
    res.send("User added successfully");
});

// Route to toggle payment status
app.post("/toggle-payment", (req, res) => {
    const email = req.body.email;
    const user = getUserData(email);
    if (user) {
        saveEmailAndPaymentStatus(email, !user.paid);
        res.send("Payment status toggled successfully");
    } else {
        res.status(404).send("User not found");
    }
});

// Route to remove a user
app.post("/remove-user", (req, res) => {
    const email = req.body.email;
    removeUser(email);
    res.send("User removed successfully");
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
