const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve admin.html at the root URL
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/admin.html');
});

// Serve admin.js at the /admin.js URL
app.get('/admin.js', (req, res) => {
    res.sendFile(__dirname + '/admin.js');
});

// Load user data from info.txt and send it as JSON
app.get('/get-users', (req, res) => {
    fs.readFile('info.txt', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading info.txt:', err);
            res.status(500).send({ error: 'Internal server error' });
            return;
        }
        // Parse the data from info.txt into a JSON array
        const users = data.split('\n').map(line => {
            const [email, paid] = line.split(',');
            return { email, paid: paid === 'true' };
        });
        res.json(users);
    });
});

// Add a new user to info.txt
app.post('/save-data', (req, res) => {
    const { email, isPaid } = req.body;
    if (!email) {
        res.status(400).send({ error: 'Email is required' });
        return;
    }

    // Append the new user to info.txt
    const newUserLine = `${email},${isPaid || false}\n`;
    fs.appendFile('info.txt', newUserLine, (err) => {
        if (err) {
            console.error('Error writing to info.txt:', err);
            res.status(500).send({ error: 'Internal server error' });
            return;
        }
        res.sendStatus(200);
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
