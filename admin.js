document.addEventListener('DOMContentLoaded', () => {
    // Function to render user data as rows in the table
    const renderUser = (user) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.email}</td>
            <td>${user.paid ? 'True' : 'False'}</td>
            <td><button data-email="${user.email}">Toggle</button></td>
        `;
        return row;
    };

    // Function to fetch and display user data
    const loadUsers = () => {
        fetch('/get-users')
            .then((response) => response.json())
            .then((data) => {
                const userTable = document.getElementById('userTable');
                userTable.innerHTML = ''; // Clear existing rows

                data.forEach((user) => {
                    const row = renderUser(user);
                    userTable.appendChild(row);

                    // Add event listener to toggle button
                    const toggleButton = row.querySelector('button');
                    toggleButton.addEventListener('click', () => {
                        togglePaidStatus(user.email);
                    });
                });
            });
    };

    // Function to toggle the paid status
    const togglePaidStatus = (email) => {
        fetch('/toggle-paid', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
        })
        .then((response) => {
            if (response.ok) {
                loadUsers(); // Reload the user data after the update
            } else {
                console.error('Error toggling paid status:', response.statusText);
            }
        })
        .catch((error) => {
            console.error('Error toggling paid status:', error);
        });
    };

    // Initial load of user data
    loadUsers();

    // jQuery code for adding users
    const addUserButton = $("#addUserButton");
    const newUserInput = $("#newUserInput");
    const userList = $("#userList");

    // Function to load users from the server and display them
    function loadUsers() {
        $.ajax({
            type: "GET",
            url: "/get-users", // This matches the server route
            dataType: "json",
            success: function (data) {
                userList.empty(); // Clear the user list
                data.forEach(function (user) {
                    userList.append(`<li>${user.email} (Paid: ${user.paid ? "Yes" : "No"})</li>`);
                });
            },
            error: function (err) {
                console.error("Error loading users:", err);
            }
        });
    }

    // Event listener to add a new user
    addUserButton.click(function () {
        const newEmail = newUserInput.val().trim();
        if (newEmail) {
            $.ajax({
                type: "POST",
                url: "/save-data", // This matches the server route
                data: { email: newEmail, isPaid: false }, // Change isPaid as needed
                success: function () {
                    newUserInput.val(""); // Clear the input
                    loadUsers(); // Reload the user list after addition
                },
                error: function (err) {
                    console.error("Error adding user:", err);
                }
            });
        }
    });

    // Load users when the page loads
    loadUsers();
});
