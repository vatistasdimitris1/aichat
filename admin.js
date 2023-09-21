import { getAllUserData } from './info.js';

document.addEventListener("DOMContentLoaded", function () {
    const userInfoContainer = document.getElementById("user-info");

    const users = getAllUserData();

    if (users.length === 0) {
        userInfoContainer.textContent = "No user data available.";
    } else {
        const userList = document.createElement("ul");

        users.forEach(user => {
            const listItem = document.createElement("li");
            listItem.textContent = `Email: ${user.email}, Paid: ${user.paid ? "Yes" : "No"}`;
            userList.appendChild(listItem);
        });

        userInfoContainer.appendChild(userList);
    }
});
