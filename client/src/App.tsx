import { useEffect, useRef, useState } from 'react'
import { socket } from './socket'

export function App() {
  const [message, setMessage] = useState('')
  const [receivedMessages, setReceivedMessages] = useState<string[]>([])

  const ref = useRef<HTMLDivElement>()

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

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollTo(0, ref.current.scrollHeight)
    }
  }, [receivedMessages])

  const sendMessage = () => {
    socket.emit('message', message)
    setMessage('')
  }

  return (
    <main
      style={{
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
      }}
    >
      <h1 style={{ paddingBottom: '40px' }}>Home Page</h1>
      <div ref={ref} style={{ height: 200, overflowY: 'scroll', width: 300 }}>
        {receivedMessages.map((message) => (
          <div key={message} style={{ padding: '4px 6px' }}>
            {message}
          </div>
        ))}
      </div>
      <div style={{ paddingTop: '40px' }}>
        <input
          style={{ width: '250px' }}
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
