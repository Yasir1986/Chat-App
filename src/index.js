const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')
 
app.use(express.static(publicDirectoryPath))

io.on('connection', (socket) => {
    console.log("Web socket connection...")

    //for single connected client
    socket.emit('message', 'Welcome!')
    socket.broadcast.emit('message', 'A new user has joined!' )

    socket.on('sendMessage', (message) => {
    //for every connected client
        io.emit('message', message)
    })

    socket.on('disconnect', () => {
        io.emit('message', 'A user has left!')
    })
})

// server (emit) => clinet (receive) - countUpdated
// client (emit) => server (receive) - increment

server.listen(port, () => {
    console.log(`Server is up on port ${port}!`)
})
