// Sample user data (replace with your data)
const users = [
    { email: 'user@example.com', paid: false },
    { email: 'familyvatistas90@gmail.com', paid: true },
    { email: 'DimVat', paid: true }
    // Add more user data as needed
];

// Function to get user data by email
function getUserData(email) {
    return users.find(user => user.email === email);
}

// Function to save email and payment status to info.js
function saveEmailAndPaymentStatus(email, isPaid) {
    const user = getUserData(email);

    if (user) {
        user.email = email; // Update the user's email
        user.paid = isPaid; // Update the payment status
    }
}

// Function to check if the user has already paid
function checkPaymentAndEmail() {
    const email = document.getElementById('email-input').value;

    // Call the function to get user data by email
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
    const email = document.getElementById('email-input').value;
    const isPaid = false; // Set this to true if the user has already paid

    // Call the function to save email and payment status
    saveEmailAndPaymentStatus(email, isPaid);

    // Optionally, you can redirect the user to another page here
});

// Event listener for the "Already" button
document.getElementById('check-payment-button').addEventListener('click', checkPaymentAndEmail);
