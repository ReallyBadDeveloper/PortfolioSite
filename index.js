const express = require('express')
const sudoprompt = require('sudo-prompt')
const ipban = require('./ipban.js')
const proxy = require('express-http-proxy')
const app = express()
const dotenv = require('dotenv').config()
const https = require('https')
const fs = require('fs')
const path = require('path')
const { stdout } = require('process')
const config = require('./config.json')
const port = !config.dev ? 443 : 80

if (!config.dev == true) {
	const cts = {
		cert: fs.readFileSync(process.env.CERT_DIR),
		key: fs.readFileSync(process.env.KEY_DIR),
	}

	sudoprompt.exec('cat ' + process.env.CERT_DIR, (stdout, stderr) => {
		if (stderr) throw stderr
		cts.cert = stdout
	})

	sudoprompt.exec('cat ' + process.env.KEY_DIR, (stdout, stderr) => {
		if (stderr) throw stderr
		cts.key = stdout
	})
}

ipban.init()

app.use(express.json())
app.use((req, res, next) => {
	if (ipban.checkIP(ipban.getIP(req)) === true) {
		res.status(401).json(
			JSON.stringify({
				warning: 'You have been IP banned.',
			})
		)
		return
	}
	next()
})

app.use(express.urlencoded({ extended: false }))
app.use(express.static('public'))

app.get('/', (req, res) => {
	if (ipban.checkIP(ipban.getIP(req)) === true) {
		res.status(401).send(
			JSON.stringify({
				warning: 'You have been IP banned.',
			})
		)
	}
	res.sendFile(__dirname + `/index.html`)
})

app.get('/contact', (req, res) => {
	if (ipban.checkIP(ipban.getIP(req)) === true) {
		res.status(401).send(
			JSON.stringify({
				warning: 'You have been IP banned.',
			})
		)
	}
	res.sendFile(__dirname + `/contact.html`)
})

app.post('/contactsubmit', (req, res) => {
	var body = req.body
	if (typeof req.body.name !== 'string') {
		ipban.ban(ipban.getIP(req))
		res.status(401).send(
			JSON.stringify({
				warning: 'You have been IP banned.',
			})
		)
		return
	}
	fetch(process.env.WEBHOOK, {
		method: 'post',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			embeds: [
				{
					title: `Message from ${body.name} (${body.email})`,
					description: `**Message:**\n${'```'}${body.msg}${'```'}`,
					color: 16540159,
				},
			],
		}),
	})
	res.status(200)
})

app.use((req, res, next) => {
	res.sendFile(__dirname + '/404.html')
})

if (config.dev == true) {
	app.listen(port, () => {
		console.log(
			`HTTP${config.dev ? '' : 'S'} server listening on port ${port}`
		)
	})
} if (config.dev == false) {
	https.createServer(cts, app).listen(port, () => {
		console.log(
			`HTTP${config.dev ? '' : 'S'} server listening on port ${port}`
		)
	})
}
