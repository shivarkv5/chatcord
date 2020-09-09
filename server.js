
const path = require("path")
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const formatMessage = require("./utils/formatMessages")
const { userFun, getCurrentUser, userLeaves, getUsers } = require("./utils/users")



const app = express();
const server = http.createServer(app);
const io = socketio(server); // Attaching socket.io to an http.server instance(server)  

app.use(express.static(path.join(__dirname, 'public')))

const botName = 'ChatCord';

// It will run when client connects
// With io object and on method. It will listen for some event  for connection. param of socket fn.
// When client connects it should display message in console.log
// let user =''
io.on('connection', socket => {

    socket.on("params", ({ username, room }) => {
        //Calling userFun function in users.js
        console.log({ username, room })
        const user = userFun(socket.id, username, room);
        console.log(user)
        socket.join(user.room)
        // Welcomes the current user.
        socket.emit("message", formatMessage(botName, "Welcome to chat"));

        // Broadcast all the user except the connecting user.
        socket.broadcast.to(user.room).emit("message", formatMessage(botName, `${user.username} has joined the chat`))


        //Send users and room info
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getUsers(user.room)
        })
    })

    //Listen for chatMessage, Taking message from user.
    socket.on("chatMessage", msg => {
        const user = getCurrentUser(socket.id)
        console.log("getCurrentUser ======> \n" + JSON.stringify(user))
        io.to(user.room).emit("message", formatMessage(user.username, msg))
        console.log(JSON.stringify(formatMessage(user, msg)) + "\n <======= Inside chatMessage")
    })

    //Notifies all the users when a user disconnects
    socket.on('disconnect', () => {

        const user = userLeaves(socket.id);
        if (user) {
            io.to(user.room).emit("message", formatMessage(botName, `${user.username} left the chat group`));


            //Send users and room info
            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getUsers(user.room)
            })
        }

    });




})


const port = 3000 || process.env.port;
server.listen(port, () => { console.log("Serving running on port 3000") });