// admin.js

import { getAllUserData } from './info.js';

// Function to display updates
function displayUpdates(updateText) {
    const updateList = document.getElementById('update-list');
    const updateItem = document.createElement('li');
    updateItem.textContent = updateText;
    updateList.appendChild(updateItem);
}

// Function to display user data in the table
function displayUserData() {
    const userList = document.getElementById('user-list');
    const userData = getAllUserData();

    userData.forEach(user => {
        const row = userList.insertRow();
        const emailCell = row.insertCell(0);
        const paymentCell = row.insertCell(1);

        emailCell.textContent = user.email;
        paymentCell.textContent = user.paid ? 'Paid' : 'Not Paid';
    });
}

// Function to initialize the admin panel
function initializeAdminPanel() {
    // Add sample update text
    displayUpdates('Welcome to the Admin Panel.');

    // Display user data
    displayUserData();
}

// Initialize the admin panel when the page loads
window.addEventListener('load', initializeAdminPanel);
