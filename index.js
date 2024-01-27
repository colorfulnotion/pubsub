const express = require('express');
const app = express();
const port = 80;

// Serve the HTML page
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Create an HTTP server with Express
const server = app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

