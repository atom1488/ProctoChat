require('dotenv').config()
var express = require('express');
var socket = require('socket.io');
var bcrypt = require('bcrypt');
var mongoose = require('mongoose');
var app = express();

var port = 80

var server = app.listen(port, function () {
    console.log(`\x1b[33mListening... \x1b[31mPORT:${port} \x1b[0m`);
});

mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
})

const db = mongoose.connection
db.once('open', () => console.error(`\x1b[33mMongoDB = \x1b[31mok\x1b[0m`))

db.on('error', (error) => console.error(error))

app.use(express.static('public'));
app.use(express.json())

const usersRoute = require('./routes/users.js')

app.use('/users', usersRoute)

var io = socket(server);
let socketsConected = new Set()
io.on('connection', (socket) => {
    socketsConected.add(socket.id)
    console.log('made socket connection: ', socket.id);

    socket.on('chat', function (data) {
        io.sockets.emit('chat', data);
    });

    socket.on('typing', function (data) {
        socket.broadcast.emit('typing', data)
    });

    socket.on('joined', function (data) {
        io.emit('joined', data);
    });

    socket.on('aurevoire', function (data) {
        io.emit('aurevoir', data);
    });

    socket.on('unauthorized', function (data) {
        console.log(data)
        socket.disconnect()
    })

    socket.on('disconnect', function (data) {
        console.log('socket disconnected', socket.id)
        socketsConected.delete(socket.id)
        io.emit('clients-total', socketsConected.size)
        io.emit('pasmoi', data)
    })

    io.emit('clients-total', socketsConected.size)
});
