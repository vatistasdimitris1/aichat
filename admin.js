$(document).ready(function () {
    const addUserButton = $("#add-user");
    const newUserInput = $("#new-email");
    const userList = $("#userList");

    // Function to load users from the server and display them
    function loadUsers() {
        $.ajax({
            type: "GET",
            url: "/get-users",
            dataType: "json",
            success: function (data) {
                userList.empty();
                data.forEach(function (user) {
                    userList.append(`
                        <tr>
                            <td>${user.email}</td>
                            <td>${user.paid ? "Yes" : "No"}</td>
                            <td>
                                <button class="toggle-payment" data-email="${user.email}">Toggle Payment</button>
                                <button class="remove-user" data-email="${user.email}">Remove</button>
                            </td>
                        </tr>
                    `);
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
                url: "/add-user",
                data: { email: newEmail, paid: false },
                success: function () {
                    newUserInput.val("");
                    loadUsers();
                },
                error: function (err) {
                    console.error("Error adding user:", err);
                }
            });
        }
    });

    // Event listener to toggle payment status
    userList.on("click", ".toggle-payment", function () {
        const email = $(this).data("email");
        $.ajax({
            type: "POST",
            url: "/toggle-payment",
            data: { email: email },
            success: function () {
                loadUsers();
            },
            error: function (err) {
                console.error("Error toggling payment status:", err);
            }
        });
    });

    // Event listener to remove a user
    userList.on("click", ".remove-user", function () {
        const email = $(this).data("email");
        $.ajax({
            type: "POST",
            url: "/remove-user",
            data: { email: email },
            success: function () {
                loadUsers();
            },
            error: function (err) {
                console.error("Error removing user:", err);
            }
        });
    });

    // Load users when the page loads
    loadUsers();
});
