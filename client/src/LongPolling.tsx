import { useEffect, useState } from 'react'

export const LongPolling = () => {
  const [message, setMessage] = useState<string>('')
  const [messages, setMessages] = useState<string[]>([])

  const subscibe = async () => {
    try {
      const res = await fetch('http://localhost:3000/get-messages', {
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!res.ok) {
        throw new Error('Failed to fetch messages')
      }

      const data = await res.json()
      setMessages((state) => [...state, data.message])

      void subscibe()
    } catch (e) {
      console.error('Error fetching messages:', e.message)
      setTimeout(subscibe, 1000)
    }
  }

  useEffect(() => {
    void subscibe()
  }, [])

  const sendMessage = async () => {
    const res = await fetch('http://localhost:3000/new-messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    })

    setMessage('')

    console.log(res.status)
  }

  return (
    <div>
      <h2>Long polling</h2>
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
