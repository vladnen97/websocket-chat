import { useEffect, useState } from 'react'

export const ServerSentEvent = () => {
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<string[]>([])

  useEffect(() => {
    void subscribe()
  }, [])

  const subscribe = async () => {
    const eventSource = new EventSource('http://localhost:3000/sse/connect')

    eventSource.onmessage = (ev) => {
      setMessages((state) => [...state, ev.data])
    }
  }

  const sendMessage = async () => {
    await fetch('http://localhost:3000/sse/new-messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    })

    setMessage('')
  }

  return (
    <div>
      <h2>Server sent event</h2>
      <div
        style={{
          height: 200,
          overflowY: 'auto',
          width: 300,
          border: '1px solid black',
          padding: '10px 0',
        }}
      >
        {messages.map((msg, i) => (
          <div style={{ padding: '4px 6px' }} key={i}>
            {msg}
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
        <button disabled={!message.trim()} onClick={sendMessage}>
          send
        </button>
      </div>
    </div>
  )
}
