const express = require('express');
const app = express();
const path = require('path');
const socketIO = require('socket.io');
const http = require('http');
const moment = require('moment');
const {generateMessage, generateLocation} = require('./utils/message');
const validator = require('validator');
const {Users} = require('./utils/users');

var users = new Users();

// const publicPath = path.join(__dirname, '../public');
// app.use(express.static('publicPath'));
app.use(express.static('public'));


var port = process.env.PORT || 3000;

var server = http.createServer(app);
var io = socketIO(server);

io.on('connection', (socket) => {
    console.log('Now user connected');


    socket.on('join', (param, callback) => {
        var name = validator.trim(param.name);
        var room = validator.trim(param.room);
        if(validator.isEmpty(room) || validator.isEmpty(name))
        {
            callback('Name and Room are required to chat. please go back and fill.');

        }

        socket.join(param.room);
        users.removeUser(socket.id);
        var res =  users.addUser(socket.id, param.name, param.room);

        io.to(param.room).emit("updateUserList", users.getUserList(param.room));

        socket.emit("newMessage", generateMessage('Admin', 'Welcome to the Chat App !', moment().format('hh:mm A')));
    
        socket.to(param.room).broadcast.emit('newMessage', generateMessage('Admin', `${param.name} has joined ${param.room}`, moment().format('hh:mm A')));
        
        callback();
        
        
    });



        socket.on('createMessage', (msg, callback) => {
            console.log("new msg recieved from user", msg);
            var {room} = users.getUser(socket.id);
            io.to(room).emit('newMessage', generateMessage(msg.from, msg.text, msg.createdAt));
            callback('this is from server');
        });
        socket.on('shareLocation', (location, callback) => {
            console.log("new msg recieved from user", location);
            var {room} = users.getUser(socket.id);
            io.to(room).emit('newLocation', generateLocation(location.from, location.url, location.createdAt));
            callback('this is from server');
        });

    socket.on('disconnect', () => {
        users.removeUser(socket.id);
        console.log('user disconnected');
    });

});



server.listen(port, () => {
    console.log(`server running at port : ${port}`);
});

