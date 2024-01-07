import React, { useEffect, useMemo, useState } from 'react'

function Chat({ socket, username, room }) {

  const [currentMessage, setCurrentMessage] = useState("")


  const sendMessage = async () => {
    if (currentMessage !== "") {
      const hours = new Date(Date.now()).getHours();
      const minutes = new Date(Date.now()).getMinutes();
      const messageData = {
        room: room,
        message: currentMessage,
        author: username,
        time: hours + ":" + minutes
      }

      await socket.emit("send_message", messageData);
    }
  }

  useEffect(() => {
    socket.on("receive_message", (data) => {
      console.log(data)
    })

  }, [socket])



  return (
    <div>
      <div>
        Header
      </div>
      <div>
        Body
      </div>
      <div>
        <input type='text' placeholder='Hey...' onChange={(e) => { setCurrentMessage(e.target.value) }} />
        <button onClick={sendMessage}> &#9658; </button>
      </div>
    </div>
  )
}

export default Chat