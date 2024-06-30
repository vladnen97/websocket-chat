import express, { Request, Response } from 'express'
import { createServer } from 'http'
import { Server, Socket } from 'socket.io'

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

// Обработка маршрута по умолчанию
app.get('/', (req: Request, res: Response) => {
  res.send('Hello, TypeScript with Express and Socket.io!')
})

// Обработка соединений
io.on('connection', (socket: Socket) => {
  console.log('a user connected')
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
