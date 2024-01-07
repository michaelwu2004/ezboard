import { useState } from 'react'
import io from 'socket.io-client'
import Chat from './Chat'

const socket = io.connect("http://localhost:3001")

function Test() {

  const [username, setUsername] = useState("")
  const [room, setRoom] = useState("")

  const joinRoom = () => {
    if (username !== "" && room !== "") {
      socket.emit("join_room", (room))
    }
  }

  return (
    <div className='flex flex-col'>

      <input type="text" placeholder='Enter username' onChange={(e) => { setUsername(e.target.value) }} />
      <input type="text" placeholder='Enter room ID' onChange={(e) => { setRoom(e.target.value) }} />
      <button onClick={joinRoom}> Join a room</button>

      <Chat socket={socket} username={username} room={room} />
    </div>
  )
}

export default Test