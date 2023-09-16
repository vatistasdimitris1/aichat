// Function to save user information to localStorage
function saveUserInfo(email, password) {
    localStorage.setItem("email", email);
    localStorage.setItem("password", password);
}

// Function to get user information from localStorage
function getUserInfo() {
    const email = localStorage.getItem("email");
    const password = localStorage.getItem("password");
    return { email, password };
}
