import { useEffect, useState } from 'react'

function Chat({ socket, username, room }) {

  const [currentMessage, setCurrentMessage] = useState("")
  const [messageList, setMessageList] = useState([])

  const sendMessage = async () => {
    if (currentMessage !== "") {
      const hours = ("0" + new Date(Date.now()).getHours()).slice(-2);
      const minutes = ("0" + new Date(Date.now()).getMinutes()).slice(-2);

      const messageData = {
        room: room,
        message: currentMessage,
        author: username,
        time: hours + ":" + minutes
      }

      await socket.emit("send_message", messageData);
      setMessageList((list) => [...list, messageData])
    }
  }

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessageList((list) => [...list, data])
    })

  }, [socket])

  // When the room changes leave chat
  useEffect(() => {
    setMessageList([])
  }, [room])



  return (
    <div className='flex flex-col border min-w-72 max-w-72 z-50'>
      <div className='flame rounded-t font-bold'>
        Chat
      </div>
      <div className='h-64 overflow-y-auto overflow-x-auto z-50'>
        {messageList.map((messageData, key) => {
          return (
            <div key={key} className='flex flex-col p-2'>

              <div className='p-1 w-fit'>
                {messageData.message}
              </div>
              <div className='flex flex-row'>
                <div className='text-xs text-left truncate max-w-12'>
                  {messageData.author}
                </div>
                <div className='text-xs text-left'>
                  @ {messageData.time}
                </div>
              </div>
            </div>
          )
        })}
      </div>
      <div className='p-2 w-full'>
        <input className='w-10/12' type='text' placeholder='Hey...' onChange={(e) => { setCurrentMessage(e.target.value) }} />
        <button onClick={sendMessage}> &#9658; </button>
      </div>
    </div>
  )
}

export default Chat