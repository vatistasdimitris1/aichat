// info.js

$(document).ready(function () {
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

    // Function to automatically capture email and payment details when signing up
    $("#signupForm").submit(function (event) {
        event.preventDefault(); // Prevent the default form submission

        const email = $("#emailInput").val().trim();
        const isPaid = $("#paymentCheckbox").is(":checked");

        if (email) {
            // Send the data to the server
            $.ajax({
                type: "POST",
                url: "/signup", // Replace with your signup route
                data: { email: email, isPaid: isPaid },
                success: function () {
                    // Clear the form after submission
                    $("#emailInput").val("");
                    $("#paymentCheckbox").prop("checked", false);
                    // Optionally, you can provide feedback to the user here
                    console.log("Signup successful!");
                },
                error: function (err) {
                    console.error("Error during signup:", err);
                    // Handle signup errors here
                }
            });
        }
    });

    // Load users when the page loads
    loadUsers();
});
