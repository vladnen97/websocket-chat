import { LongPolling } from './LongPolling'
import { WebSocket } from './WebSocket'
import { ServerSentEvent } from './ServerSentEvent'

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

        <ServerSentEvent />
      </div>
    </main>
  )
}
