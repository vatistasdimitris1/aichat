// info.js

// Simulated user data storage
const userData = [
    { email: "familyvatistas90@gmail.com", paid: true },
    { email: "user2@example.com", paid: false },
    { email: "user3@example.com", paid: true },
];

// Function to get user data by email
export function getUserData(email) {
    return userData.find(user => user.email === email);
}

// Function to get all user data
export function getAllUserData() {
    return userData;
}

// Function to save email and payment status
export function saveEmailAndPaymentStatus(email, paid) {
    userData.push({ email, paid });
}

// Function to check if the user has already paid
export function checkPaymentAndEmail() {
    const emailInput = document.getElementById('email-input');
    const email = emailInput.value.trim();
    const user = getUserData(email);

    if (user && user.paid) {
        // User has already paid, perform the desired action
        console.log('User has already paid.');
    } else {
        // User has not paid, perform the desired action
        console.log('User has not paid.');
    }
}

// Event listener for the "Next" button
document.getElementById('next-button').addEventListener('click', function () {
    const emailInput = document.getElementById('email-input');
    const email = emailInput.value.trim();
    const isPaid = false; // Set this to true if the user has already paid

    // Call the function to save email and payment status
    saveEmailAndPaymentStatus(email, isPaid);

    // Optionally, you can redirect the user to another page here
});

// Event listener for the "Already Paid" button
document.getElementById('check-payment-button').addEventListener('click', checkPaymentAndEmail);
