const express = require('express')
const router = express.Router();
const loginModel = require('../models/users.js');
const bcrypt = require('bcrypt')

router.get('/', async (req, res) => {
    try {
        res.send(`<!DOCTYPE html>
    <html lang="en">
    <head>
    <style>
    body {
        color:white;
        background-color: black;
        font-size: 20px;
    }
    </style>
    <meta charset="utf-8">
    <title>Error</title>
    </head>
    <body>
    <pre>Cannot GET /users</pre>
    <pre>Imagine vouloir baiser mon chat srx</pre>
    </body>
    </html>`)
    } catch (e) {
        res.status(500).json({
            message: err.message
        })
    }
})

//register account
router.post('/register', async (req, res) => {
    var existing = false;
    if (req.body.name == "") {
        return res.status(400).send('<p>Il manque le nom d\'utilisateur</p>')
    }
    if (req.body.name.includes('<') || req.body.name.includes('>')) {
        return res.status(400).send('<p>Vous ne pouvez pas mettre de < > dans votre pseudo !</p>')
    }
    if (req.body.name.length > 15) {
        return res.status(400).send(`<p>La taille maximale pour un pseudo est de 15 caracteres.</p>`)
    }
    if (req.body.name.length < 3) {
        return res.status(400).send(`<p>La taille minimale pour un pseudo est de 3 caracteres.</p>`)
    }
    if (req.body.password == "") {
        return res.status(400).send('<p>Il manque le mot de passe</p>')
    }
    if (req.body.password.length < 6) {
        return res.status(400).send(`<p>La taille minimale pour un mot de passe est de 6 caracteres.</p>`)
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    try {
        const login = await loginModel.findOne({
            name: req.body.name
        })

        if (login) {
            return res.status(400).send(`<p>Le nom d'utilisateur existe deja !</p>`)
        } else {

            if (existing == true) return;

            const register = new loginModel({
                name: req.body.name,
                password: hashedPassword
            })
            const newUser = await register.save()

            return res.status(201).send(`<p>Bienvenue <strong>${req.body.name}</strong>!</p>`)
        }
    } catch (error) {
        return res.status(400).json({
            message: error.message
        })
    }
})

//login in
router.post('/login', async (req, res) => {
    try {
        const login = await loginModel.findOne({
            name: req.body.name
        })

        if (!login) return res.status(400).send('<p>Impossible de trouver l\'utilisateur</p>')

        if (await bcrypt.compare(req.body.password, login.password)) {
            //! critiquer = gay !!
            res.send(`<!DOCTYPE html>
            <html>

            <head>
                <meta content="text/html;charset=utf-8" http-equiv="Content-Type">
                <meta content="utf-8" http-equiv="encoding">
                <title>ProctoChat v1.0</title>
                <script src="https://cdn.socket.io/4.0.1/socket.io.js"></script>
                <link href="/styles.css" rel="stylesheet" />
                <link rel="shortcut icon" type="images/x-icon" href="favicon.ico" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>

            <body>
                <div id="procto-logo" class="procto-logo">
                    <p>ProctoChat</p>
                </div>
                <div id="procto-chat">
                    <div id="chat-window">
                        <div id="output">
                            <div id="joined"></div>
                            <div id="feedback"></div>
                        </div>
                    </div>
                    <div id="handle">
                    <p>Pseudo: ${req.body.name}</p>
                    </div>
                    <h3 id="pseudo">${req.body.name}</h3>
                    <input id="message" type="text" placeholder="Message" />
                    <button id="send">Envoyer</button>
                    <div id="modal" class="modal">
                        <div id="modal-content" class="modal-content">
                            <span class="close">&times;</span>
                            <p id="modalcontentp">...</p>
                        </div>
                    </div>
                </div>
                <p id="connected"></p>
                <p class="footer">Made with <strong>❤️</strong> by atomkern</p>
                <script src="/chat.js"></script>
            </body>

            </html>`)
        } else {
            res.send(`
            <!DOCTYPE html>
            <html>
            <head>
                <meta content="text/html;charset=utf-8" http-equiv="Content-Type">
                <meta content="utf-8" http-equiv="encoding">
                <title>ProctoChat v1.0</title>
                <link href="/styles.css" rel="stylesheet" />
                <link rel="shortcut icon" type="images/x-icon" href="favicon.ico" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body>
                <div id="procto-logo" class="procto-logo">
                    <p>Mauvais mot de passe.</p>
                </div>
            </body>
            </html>`)
        }
    } catch (e) {
        res.status(500).send(`<p>Erreur</p>`)
    }
})

//deleting account
router.delete('/', async (req, res) => {
    try {
        const login = await loginModel.findOne({
            name: req.body.name
        })

        if (!login) return res.status(400).send('<p>Impossible de trouver l\'utilisateur</p>')

        if (await bcrypt.compare(req.body.password, login.password)) {
            const login = await loginModel.findOneAndDelete({
                name: req.body.name
            })
            res.status(201).send(`<p>Le compte a bien été supprimé 😔`)
        } else {
            res.send(`
            <!DOCTYPE html>
            <html>
            <head>
                <meta content="text/html;charset=utf-8" http-equiv="Content-Type">
                <meta content="utf-8" http-equiv="encoding">
                <title>ProctoChat v1.0</title>
                <link href="/styles.css" rel="stylesheet" />
                <link rel="shortcut icon" type="images/x-icon" href="favicon.ico" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body>
                <div id="procto-logo" class="procto-logo">
                    <p>Mauvais mot de passe.</p>
                </div>
            </body>
            </html>`)
        }
    } catch (e) {
        res.status(500).send(`<p>Erreur</p>`)
    }
})


module.exports = router
