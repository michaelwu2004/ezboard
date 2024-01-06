import express from 'express';
import http from 'http';
import cors from 'cors';

const app = express();
app.use(cors());

const server = http.createServer(app);

io = new Server(server, {
  cors: 'http://localhost:3000',
  methods: ["GET", "POST"]
})

io.on("connection", (socket) => {
  console.log("connection established")
})

server.listen(3001, () => {
  console.log("Server is running!")
})


