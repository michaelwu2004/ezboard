import { useState, useEffect } from 'react'
import io from 'socket.io-client'
import Draggable from 'react-draggable';
import Chat from './Chat'
import CustomInput from './CustomInput';
import DropDown from './DropDown';

const socket = io.connect("http://localhost:3001")

function Test() {

  const [roomCount, setRoomCount] = useState(1)
  const [username, setUsername] = useState("")
  const [roomId, setRoomId] = useState("")
  const [room, setRoom] = useState("")

  const joinRoom = () => {
    setRoomId(room)
    if (username !== "" && room !== "") {
      socket.emit("join_room", (room))
    }
  }

  const copyToClipBoard = () => {
    navigator.clipboard.writeText(room);
  }

  useEffect(() => {
    socket.on("initial_room", (data) => {
      setRoomId(data)
    })
    socket.on("updateUsers", (roomSize) => {
      setRoomCount(roomSize)
    })
  }, [socket])

  const joinSvg = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
  </svg>

  const copySvg = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
  </svg>

  const e = <div className='flex flex-col'>
    <CustomInput isInput={true} placeholderText={'Enter username...'} handleChange={setUsername} buttonSvg={null} />
    <CustomInput isInput={false} placeholderText={roomId} buttonSvg={copySvg} handleClick={copyToClipBoard} />
    <CustomInput isInput={true} placeholderText={'Enter room id to join...'} buttonSvg={joinSvg} handleChange={setRoom} handleClick={joinRoom} />
  </div>

  return (
    <div className='w-screen h-screen'>
      <DropDown text={'User and room info'} element={e} />
      {roomCount >= 2 ?
        <Draggable>
          <div className='relative z-50 w-fit'>
            <Chat socket={socket} username={username} room={room} />
          </div>
        </Draggable>
        :
        null
      }
    </div>
  )
}

export default Test