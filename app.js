var express = require('express');
var app = express();
const axios = require('axios');
const path = require('path');
const http = require('http');
const server = http.createServer(app);
// app.use(express.urlencoded({extended : false}))
// app.use(express.static())
// Node server which will handle socket io connections
app.use(express.static(path.join(__dirname,'./public')));
app.get('/',(req,res)=>{
    res.sendFile(path. join(__dirname + '/index.html'));
});

const io = require('socket.io')(server)
const users = {};
io.on('connection',socket=>{
    socket.on('new-user',name=>{ 
        // console.log("name = ",name);
        users[socket.id] = name;
        // console.log("users = ",users);
        socket.broadcast.emit('user-joined',name);
    })
    socket.on('send',message=>{
        socket.broadcast.emit('receive',{message:message,name:users[socket.id]});
    })
    socket.on('disconnect', message =>{
        socket.broadcast.emit('left', users[socket.id]);
        delete users[socket.id];
    });
})

const port = process.env.PORT || 3000;

server.listen(port,()=> console.log(`Server Running at ${port}`));

