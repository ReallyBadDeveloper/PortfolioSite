const express = require('express');
const ipban = require('./ipban.js');
const proxy = require('express-http-proxy');
const app = express();
const dotenv = require('dotenv').config();
const port = 80;

ipban.init();

app.use(express.json());
app.use((req, res, next) => {
    if (ipban.checkIP(ipban.getIP(req)) === true) {
        res.status(401).json(JSON.stringify({
            warning: "You have been IP banned."
        }));
        return;
    }
    next();
});

app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));

app.get('/', (req,res) => {
    if (ipban.checkIP(ipban.getIP(req)) === true) {
        res.status(401).send(JSON.stringify({
            warning: "You have been IP banned."
        }))
    }
    res.sendFile(__dirname + `/index.html`);
});

app.get('/contact', (req,res) => {
    if (ipban.checkIP(ipban.getIP(req)) === true) {
        res.status(401).send(JSON.stringify({
            warning: "You have been IP banned."
        }))
    }
    res.sendFile(__dirname + `/contact.html`);
});

app.post('/contactsubmit', (req,res) => {
    var body = req.body;
    if (typeof req.body.name !== 'string') {
        ipban.ban(ipban.getIP(req));
        res.status(401).send(JSON.stringify({
            warning: "You have been IP banned."
        }));
        return;
    }
    fetch(process.env.WEBHOOK, {
        method: 'post',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            embeds: [
                {
                    title: `Message from ${body.name} (${body.email})`,
                    description: `**Message:**\n${'```'}${body.msg}${'```'}`,
                    color: 16540159,

                }
            ]
        })
    })
    res.status(200);
});

app.use((req,res,next) => {
    res.sendFile(__dirname + '/404.html');
});

app.listen(port, () => {
    console.debug(`Server listening on port ${port}`);
})