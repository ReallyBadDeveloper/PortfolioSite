const express = require('express');
const app = express();
const port = 3000;

app.use(express.static('public'));

app.get('/', (req,res) => {
    res.sendFile(__dirname + `/index.html`);
});

app.use((req, res, next) => {
    res.status(404).sendFile(__dirname + '/404.html')
});

app.listen(port, () => {
    console.debug(`Server listening on port ${[port]}`);
})