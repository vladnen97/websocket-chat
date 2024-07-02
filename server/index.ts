import express, { Request, Response } from 'express'
import { createServer } from 'http'
import cors from 'cors'
import { Server, Socket } from 'socket.io'
import { EventEmitter } from 'events'

const emitter = new EventEmitter()

const app = express()
const port = 3000

const messages: string[] = []

const httpServer = createServer(app)
const io = new Server(httpServer, {
  connectionStateRecovery: {},
  cors: {
    origin: '*',
  },
})

app.use(express.json())
app.use(cors())

// Обработка маршрута по умолчанию
app.get('/', (req: Request, res: Response) => {
  res.send({ message: 'Hello, TypeScript with Express and Socket.io!' })
})

app.get('/get-messages', (req: Request, res: Response) => {
  emitter.once('newMessage', (message: string) => {
    res.json({ message })
  })
})

app.get('/sse/connect', (req: Request, res: Response) => {
  res.writeHead(200, {
    Connection: 'keep-alive',
    'Content-type': 'text/event-stream',
    'Cache-Control': 'no-cache',
  })

  emitter.on('newMessageSSE', (message: string) => {
    res.write(`data: ${message}\n\n`)
  })
})

app.post('/sse/new-messages', (req: Request, res: Response) => {
  const { message } = req.body

  emitter.emit('newMessageSSE', message)

  res.status(200).json()
})

app.post('/new-messages', (req: Request, res: Response) => {
  const { message } = req.body

  emitter.emit('newMessage', message)

  res.status(200).json()
})

// Обработка соединений
io.on('connection', (socket: Socket) => {
  console.log('a user connected', socket.id)
  socket.emit('init messages', messages)

  socket.on('disconnect', () => {
    console.log('user disconnected')
  })

  socket.on('message', (msg: string) => {
    messages.push(msg)

    io.emit('new message', msg)
  })
})

// Запуск сервера
httpServer.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`)
})
