$(document).ready(function () {
    const newUserInput = $("#new-email");
    const userList = $("#userList");

    // Function to load users from the server and display them
    function loadUsers() {
        $.ajax({
            type: "GET",
            url: "/get-users", // Adjust the URL as needed
            dataType: "json",
            success: function (data) {
                userList.empty(); // Clear the user list
                data.forEach(function (user) {
                    userList.append(`<tr data-email="${user.email}">
                        <td>${user.email}</td>
                        <td>${user.paid ? "Yes" : "No"}</td>
                        <td>
                            <button class="edit-user">Edit</button>
                            <button class="remove-user">Remove</button>
                        </td>
                    </tr>`);
                });
            },
            error: function (err) {
                console.error("Error loading users:", err);
            }
        });
    }

    // Load users when the page loads
    loadUsers();

    // Event listener to add a new user
    $("#add-user").click(function () {
        const newEmail = newUserInput.val().trim();
        if (newEmail) {
            $.ajax({
                type: "POST",
                url: "/add-user", // Adjust the URL as needed
                data: { email: newEmail },
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

    // Event listener to remove a user
    userList.on("click", ".remove-user", function () {
        const email = $(this).closest("tr").data("email");
        if (email) {
            $.ajax({
                type: "POST",
                url: "/remove-user", // Adjust the URL as needed
                data: { email: email },
                success: function () {
                    loadUsers(); // Reload the user list after removal
                },
                error: function (err) {
                    console.error("Error removing user:", err);
                }
            });
        }
    });

    // Event listener to edit a user's payment status
    userList.on("click", ".edit-user", function () {
        const email = $(this).closest("tr").data("email");
        const row = $(this).closest("tr");
        if (email) {
            const isPaid = row.find("td:eq(1)").text() === "Yes" ? false : true;
            $.ajax({
                type: "POST",
                url: "/edit-user", // Adjust the URL as needed
                data: { email: email, paid: isPaid },
                success: function () {
                    loadUsers(); // Reload the user list after editing
                },
                error: function (err) {
                    console.error("Error editing user:", err);
                }
            });
        }
    });
});
