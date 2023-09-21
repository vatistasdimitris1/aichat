import { getUsers, addUser, removeUser } from './info.js';

document.addEventListener("DOMContentLoaded", function () {
    const userList = document.getElementById("user-list");
    const newUserInput = document.getElementById("new-email");
    const addUserButton = document.getElementById("add-user");
    const { saveEmailAndPaymentStatus, getUsers } = require('./info.js');

    // Load initial user data
    loadUsers();

    // Load user data and populate the table
    function loadUsers() {
        userList.innerHTML = ""; // Clear the existing user list
        const users = getUsers();

        users.forEach(user => {
            const row = document.createElement("tr");
            const emailCell = document.createElement("td");
            const paidCell = document.createElement("td");
            const actionsCell = document.createElement("td");
            const removeButton = document.createElement("button");

            emailCell.textContent = user.email;
            paidCell.textContent = user.paid ? "Yes" : "No";

            removeButton.textContent = "Remove";
            removeButton.addEventListener("click", () => {
                removeUser(user.email);
                loadUsers(); // Reload the user list after removal
            });

            actionsCell.appendChild(removeButton);

            row.appendChild(emailCell);
            row.appendChild(paidCell);
            row.appendChild(actionsCell);

            userList.appendChild(row);
        });
    }

    // Add a new user
    addUserButton.addEventListener("click", () => {
        const newEmail = newUserInput.value.trim();
        if (newEmail) {
            addUser({ email: newEmail, paid: false });
            newUserInput.value = ""; // Clear the input
            loadUsers(); // Reload the user list after addition
        }
    });

// Add a new user
addUserButton.addEventListener("click", () => {
    const newEmail = newUserInput.value.trim();
    if (newEmail) {
        addUser({ email: newEmail, paid: false });
        saveEmailAndPaymentStatus(newEmail, false); // Update user data in info.js
        newUserInput.value = ""; // Clear the input
        loadUsers(); // Reload the user list after addition
        saveUsersToTxt(); // Save users to info.txt
    }
});
