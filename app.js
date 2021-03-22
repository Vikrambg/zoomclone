const path = require('path')
const express = require('express')
const dotenv = require('dotenv')


///Load Configuration File
dotenv.config({path: './config/config.env'})

const app = express()

const server = require('http').Server(app)
const io = require('socket.io')(server)
const{ ExpressPeerServer} = require('peer')
const peerServer = ExpressPeerServer(server,{ debug:true})

///Setups Views
app.set('view engine', '.ejs')

///Static Folder
app.use(express.static(path.join(__dirname,'public')))

app.use('/peerjs', peerServer)

///Routes
app.use('/', require('./routes/index'))

///Socket 
io.on('connection', socket =>{
    socket.on('join-room', (roomId, userId)=>{
        //console.log(roomId, userId)
        socket.join(roomId)
        socket.to(roomId).broadcast.emit('user-connected', userId)
        socket.on('message', message =>{
            io.to(roomId).emit('createMessage', message)
        })
    })
})


const PORT = process.env.PORT || 5000

server.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`))