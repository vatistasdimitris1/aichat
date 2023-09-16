// Function to toggle the login and sign-up forms
function toggleForms() {
    const loginForm = document.getElementById("login-form");
    const signupForm = document.getElementById("signup-form");

    loginForm.classList.toggle("hidden");
    signupForm.classList.toggle("hidden");
}

// Event listener for the "Login" button to show the login form
document.getElementById("login-button").addEventListener("click", toggleForms);

// Event listener for the "Sign Up" button to show the sign-up form
document.getElementById("signup-button").addEventListener("click", toggleForms);

// Function to handle login
document.querySelector("#login-form form").addEventListener("submit", function (e) {
    e.preventDefault();
    const loginEmail = document.getElementById("login-email").value;
    const loginPassword = document.getElementById("login-password").value;

    // Check if the email and password match your stored credentials
    // For simplicity, I'm using a hardcoded email and password.
    if (loginEmail === "your@email.com" && loginPassword === "yourpassword") {
        // Successful login, store email and password (insecure for demo)
        localStorage.setItem("email", loginEmail);
        localStorage.setItem("password", loginPassword);

        // Redirect to price-plans.html
        window.location.href = "price-plans.html";
    } else {
        alert("Invalid email or password. Please try again.");
    }
});

// Function to handle sign-up
document.querySelector("#signup-form form").addEventListener("submit", function (e) {
    e.preventDefault();
    const signupEmail = document.getElementById("signup-email").value;
    const signupPassword = document.getElementById("signup-password").value;

    // Store email and password (insecure for demo)
    localStorage.setItem("email", signupEmail);
    localStorage.setItem("password", signupPassword);

    // Redirect to price-plans.html
    window.location.href = "price-plans.html";
});
