const socket = io()

const messages = document.getElementById('messages')
const form = document.getElementById('form')
const input = document.getElementById('input')
const typing = document.querySelector('#typing')

// 傳送訊息
form.addEventListener('submit', function (e) {
  e.preventDefault()
  if (input.value) {
    socket.emit('chat message', { name: username.value, message: input.value })
    input.value = ''
  }
})

// 正在打字
input.addEventListener('keydown', () => {
  socket.emit('typing')
})

socket.on('typing', (value) => {
  typing.textContent = value ? '有人在輸入....' : ''
})

// 接收歷史訊息
socket.on('all message', obj => {
  obj.forEach(msg => {
    const item = document.createElement('li')
    item.textContent = `${msg.message} ---${msg.name}`
    messages.appendChild(item)
  })
})

// 接收即時訊息
socket.on('chat message', function (obj) {
  const item = document.createElement('li')
  item.textContent = `${obj.message} ---${obj.name}`
  messages.appendChild(item)
  window.scrollTo(0, document.body.scrollHeight)
})

// 傳送滑鼠移動位置事件
window.addEventListener('mousemove', event => {
  socket.emit('mouse move', { x: event.pageX, y: event.pageY })
})

// 接收滑鼠移動位置事件
socket.on('mouse move', (obj) => {
  document.querySelector('.ball').style.left = `${obj.x}px`
  document.querySelector('.ball').style.top = `${obj.y}px`
})

