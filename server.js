const http = require('http');
const fs = require('fs');
const url = require('url');
const querystring = require('querystring');

const server = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/save-data') {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });
    req.on('end', () => {
      const data = querystring.parse(body);
      const email = data.email;
      const isPaid = data.isPaid === 'true'; // Convert to a boolean

      // Save to a text file (e.g., info.txt)
      fs.appendFile('info.txt', `${email},${isPaid}\n`, (err) => {
        if (err) {
          console.error(err);
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          res.end('Internal Server Error');
        } else {
          res.writeHead(200, { 'Content-Type': 'text/plain' });
          res.end('Data saved successfully');
        }
      });
    });
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});