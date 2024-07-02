import { useEffect, useRef, useState } from 'react'
import { socket } from './socket'

export const WebSocket = () => {
  const [status, setStatus] = useState<'connected' | 'disconnected'>()
  const [message, setMessage] = useState('')
  const [receivedMessages, setReceivedMessages] = useState<string[]>([])
  const [isAutoScroll, setIsAutoScroll] = useState<boolean>(true)

  const ref = useRef<HTMLDivElement>()

  useEffect(() => {
    socket.on('init messages', (msgs: string[]) => {
      setReceivedMessages(msgs)
    })

    socket.on('new message', (msg: string) => {
      setReceivedMessages((state) => [...state, msg])
    })

    socket.on('connect', () => {
      setStatus('connected')
    })

    socket.on('disconnect', () => {
      setStatus('disconnected')
    })

    return () => {
      socket.removeAllListeners()
    }
  }, [])

  useEffect(() => {
    if (ref.current && isAutoScroll) {
      ref.current.scrollTo(0, ref.current.scrollHeight)
    }
  }, [receivedMessages, isAutoScroll])

  const sendMessage = () => {
    socket.emit('message', message)
    setMessage('')
  }

  return (
    <div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <h2>Websocket</h2>
        <div
          style={{
            width: 14,
            height: 14,
            borderRadius: '50%',
            backgroundColor: status === 'connected' ? 'green' : 'red',
          }}
        />
      </div>
      <div
        ref={ref}
        style={{
          height: 200,
          overflowY: 'scroll',
          width: 300,
          border: '1px solid black',
          padding: '10px 0',
        }}
        onScroll={(e) => {
          const maxScrollHeight =
            e.currentTarget.scrollHeight - e.currentTarget.clientHeight

          if (maxScrollHeight === e.currentTarget.scrollTop) {
            setIsAutoScroll(true)
          } else {
            setIsAutoScroll(false)
          }
        }}
      >
        {receivedMessages.map((message, i) => (
          <div key={i} style={{ padding: '4px 6px' }}>
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
    </div>
  )
}
