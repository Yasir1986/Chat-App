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

    socket.emit('message', 'Welcome!')

    socket.on('sendMessage', (message) => {
        io.emit('message', message)
    })
})

// server (emit) => clinet (receive) - countUpdated
// client (emit) => server (receive) - increment

server.listen(port, () => {
    console.log(`Server is up on port ${port}!`)
})
