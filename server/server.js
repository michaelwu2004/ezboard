import express from 'express'
import http from 'http'
import cors from 'cors'
import { Server } from 'socket.io'

const app = express()
app.use(cors())

const server = http.createServer(app);

const io = new Server(server, {
  cors: 'http://localhost:3000',
  methods: ["GET", "POST"]
})

const rooms = {}

io.on("connection", (socket) => {
  console.log("connection established with ", socket.id)

  socket.emit("initial_room", socket.id)
  socket.join(socket.id)

  socket.on("join_room", (data) => {
    socket.join(data.room)
    //console.log(`User ${socket.id} joined ${data}`)
    if (!rooms[data.room]) {
      rooms[data.room] = []
    }

    rooms[data.room].push(data.username)
    const roomSize = io.sockets.adapter.rooms.get(data.room).size
    console.log(`USER: ${socket.id} Room ${data.room} has ${roomSize} users in it`)
    socket.emit('updateUsers', { size: roomSize, people: rooms[data.room] })
    socket.to(data.room).emit('updateUsers', { size: roomSize, people: rooms[data.room] })
  })

  socket.on("draw", (data) => {
    console.log(socket.id, "drawing", data.room)
    socket.to(data.room).emit("drawing", data)
  })

  socket.on("send_message", (data) => {
    console.log(data)
    socket.to(data.room).emit("receive_message", data)
  })

  socket.on("disconnecting", () => {
    console.log("User disconnecting: ", socket.id)
    const rooms = Array.from(socket.rooms);
    console.log(rooms)
    rooms.forEach((room) => {
      console.log(room)
      if (room !== socket.id) {
        const size = io.sockets.adapter.rooms.get(room)?.size || 0;
        console.log(size)
        io.to(room).emit('user_left', size - 1);
      }
    });
  })

  socket.on("disconnect", () => {
    console.log("User disconnected: ", socket.id)
  })
})

server.listen(3001, () => {
  console.log("Server is running!")
})


