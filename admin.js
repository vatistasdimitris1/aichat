import { getUsers, addUser, removeUser } from './info.js';

document.addEventListener('DOMContentLoaded', function () {
    const addUserForm = document.getElementById('addUserForm');
    const newUserEmail = document.getElementById('newUserEmail');
    const newUserPaid = document.getElementById('newUserPaid');
    const userList = document.getElementById('userList');

    // Function to update the user list
    function updateUsers() {
        userList.innerHTML = '';
        const users = getUsers();

        users.forEach(user => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `${user.email} (Paid: ${user.paid ? 'Yes' : 'No'})`;
            userList.appendChild(listItem);
        });
    }

    // Event listener to add a new user
    addUserForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const email = newUserEmail.value.trim();
        const isPaid = newUserPaid.checked;

        if (email) {
            addUser({ email, paid: isPaid });
            updateUsers();
            newUserEmail.value = '';
            newUserPaid.checked = false;
        }
    });

    // Event listener to remove a user (you can add more logic here)
    userList.addEventListener('click', function (e) {
        if (e.target && e.target.nodeName === 'LI') {
            const userEmail = e.target.textContent.split(' ')[0];
            removeUser(userEmail);
            updateUsers();
        }
    });

    // Initial user list update
    updateUsers();
});
