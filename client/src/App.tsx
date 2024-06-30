import { useEffect, useState } from 'react'
import { socket } from './socket'

export function App() {
  const [message, setMessage] = useState('')
  const [receivedMessages, setReceivedMessages] = useState<string[]>([])

  useEffect(() => {
    socket.on('init messages', (msgs: string[]) => {
      setReceivedMessages(msgs)
    })

    socket.on('new message', (msg: string) => {
      setReceivedMessages((state) => [...state, msg])
    })

    return () => {
      socket.removeAllListeners()
    }
  }, [])

  const sendMessage = () => {
    socket.emit('message', message)
    setMessage('')
  }

  return (
    <main>
      <h1>Home Page</h1>
      <div>
        {receivedMessages.map((message) => (
          <div key={message}>{message}</div>
        ))}
      </div>
      <div>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button onClick={sendMessage} disabled={!message.trim()}>
          send
        </button>
      </div>
    </main>
  )
}
