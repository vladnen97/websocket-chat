import { LongPolling } from './LongPolling'
import { WebSocket } from './WebSocket'

export function App() {
  return (
    <main>
      <h1
        style={{ paddingBottom: '40px', marginBottom: 0, textAlign: 'center' }}
      >
        Home Page
      </h1>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-evenly',
        }}
      >
        <LongPolling />

        <WebSocket />
      </div>
    </main>
  )
}
