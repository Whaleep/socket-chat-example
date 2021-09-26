const express = require('express')
const app = express()
const http = require('http')
const server = http.createServer(app)
const { Server } = require("socket.io")
const io = new Server(server)

app.use(express.static('public'))

// 模擬歷史訊息
const messages = [
  // { name: 'User1', message: 'Hellooooooo' }
]

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})

let isTyping = false
let typingTimer = null

io.on('connection', (socket) => {
  // 使用者連線&離線訊息
  console.log('a user connected')
  socket.on('disconnect', () => {
    console.log('user disconnected')
  })

  // 傳送歷史訊息
  socket.emit('all message', messages)

  // 傳送即時訊息
  socket.on('chat message', (obj) => {
    messages.push(obj)
    console.log(`${obj.name}說:${obj.message}`)
    io.emit('chat message', obj)
  })

  // 取得&傳送滑鼠位置
  socket.on('mouse move', (obj) => {
    io.emit('mouse move', obj)
  })

  // 取得正在輸入
  socket.on('typing', () => {
    isTyping = true
    io.emit('typing', isTyping)
    clearTimeout(typingTimer)
    typingTimer = setTimeout(() => {
      isTyping = false
      io.emit('typing', isTyping)
    }, 1500)
  })
})

server.listen(3000, () => {
  console.log('listening on *:3000')
})