import express from 'express'
import logger from 'morgan'
import dotenv from 'dotenv'
import { createClient } from '@libsql/client'

import { Server } from 'socket.io'
import { createServer } from 'node:http'

dotenv.config()

const port = process.env.PORT ?? 3000

// Create an Express application
// and a Socket.IO server
const app = express()
const server = createServer(app)
const io = new Server(server, {
  connectionStateRecovery: {}
})

const db = createClient({ // <- use the libsql client
  url: process.env.DB_URL,
  authToken: process.env.DB_TOKEN
})

// Create the messages table if it doesn't exist
await db.execute(`
  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    content TEXT,
    user TEXT
  )
`)

io.on('connection', async (socket) => { // <- use the socket.io connection
  console.log('a user has connected!')

  socket.on('disconnect', () => { //<- use the socket.io disconnect
    console.log('an user has disconnected')
  })

  socket.on('chat message', async (msg) => { // <- use the socket.io chat message to receive messages
    let result
    const username = socket.handshake.auth.username ?? 'anonymous' // <- use the socket.io auth to get the username
    console.log({ username })
    // Save the message to the database
    try {
      result = await db.execute({
        sql: 'INSERT INTO messages (content, user) VALUES (:msg, :username)',
        args: { msg, username }
      })
    } catch (e) {
      console.error(e)
      return
    }

    io.emit('chat message', msg, result.lastInsertRowid.toString(), username)
  })

  if (!socket.recovered) { // <- use the socket.io connection state recovery to check if the socket is recovered
    try {
      // Get the last 10 messages from the database
      const results = await db.execute({
        sql: 'SELECT id, content, user FROM messages WHERE id > ?',
        args: [socket.handshake.auth.serverOffset ?? 0]
      })

      results.rows.forEach(row => { // <- use the socket.io rows to get the messages
        socket.emit('chat message', row.content, row.id.toString(), row.user)
      })
    } catch (e) {
      console.error(e)
    }
  }
})

app.use(logger('dev'))

app.get('/', (req, res) => {
  res.sendFile(process.cwd() + '/client/index.html')
})

server.listen(port, () => {
  console.log(`Server running on port ${port}`)
})
