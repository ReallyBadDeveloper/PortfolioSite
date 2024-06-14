const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req,res) => {
    res.sendFile(__dirname + `/index.html`);
});

app.get('/style.css', (req,res) => {
    res.sendFile(__dirname + `/style.css`);
});

app.get('/script.js', (req,res) => {
    res.sendFile(__dirname + `/script.js`);
});

app.listen(port, () => {
    console.debug(`Server listening on port ${[port]}`);
})