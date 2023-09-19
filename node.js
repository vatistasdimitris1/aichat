const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;

app.use(express.json());

app.post('/save-user', (req, res) => {
    const { email, paid } = req.body;
    const userData = `${email}\t${paid ? 'Paid' : 'Not Paid'}`;

    fs.appendFile('info.txt', userData + '\n', (err) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error saving user data.');
        } else {
            console.log('User data saved successfully.');
            res.status(200).send('User data saved successfully.');
        }
    });
});

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
