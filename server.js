const express = require('express'),
    port = 9090,
    app = express(),
    bodyParser = require('body-parser'),
    session = require('express-session');

let color;

const server = app.listen(port, () => {
    console.log('Listening on port 9090');
});

const io = require('socket.io')(server);

io.sockets.on('connection', function(socket){
    let socketId = socket.id;
    let clientIp = socket.request.connection.remoteAddress;

    console.log(clientIp);
});

app.use(session({
    secret: 'masocket',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 }
}))

app.use(express.static(__dirname + '/static'));

app.set('views', __dirname + '/views');

app.set('view engine', 'ejs');

app.get('/', function(request, response){
    io.on('connection', function(socket){
        socket.on('connected', function(data){
            socket.emit('updateAllClients', {
                color: color
            });
        });
        socket.on('green', function(data){
            color = 'green';
            io.emit('updateAllClients', {
            color: 'green'
            });
        });
        socket.on('blue', function(data){
            color = 'blue';
            io.emit('updateAllClients', {
            color: 'blue'
            });
        });
        socket.on('pink', function(data){
            color = 'pink'
            io.emit('updateAllClients', {
            color: 'pink'
            });
        });
    });
    response.render('index');
})