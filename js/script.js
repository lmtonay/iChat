const socket = io('https://stark-stream-53300.herokuapp.com');

const form = document.getElementById('text-form');
const message = document.getElementById('message-input');
const messageContainer = document.querySelector('.messages-container');
const bell = new Audio('media/audios/bell.mp3');
const join = new Audio('media/audios/join.mp3');
const leave = new Audio('media/audios/leave.mp3');

const append = (message, position, type) => {
  const messageElement = document.createElement('div');
  messageElement.innerHTML = message;
  messageElement.classList.add(type);
  messageElement.classList.add(position);
  messageContainer.append(messageElement);
  messageContainer.scrollTop = messageContainer.scrollHeight;
};

const userName = prompt('Enter your name: ');
if (userName === null || userName === '') {
  alert('You must enter a name!');
  window.location.reload();
} else {
  document.querySelector('#user-name').innerText = userName;
  socket.emit('new-user-joined', userName);
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const text = message.value;
  if (text !== '') {
    append(`<b>You</b>: ${text}`, 'right', 'message');
    socket.emit('send', text);
    message.value = '';
  }
});

socket.on('user-joined', (name) => {
  append(`${name} joined the chat`, 'center', 'info-message');
  join.play();
});

socket.on('receive', (data) => {
  append(`<b>${data.name}</b>: ${data.message}`, 'left', 'message');
  bell.play();
});

socket.on('left', (name) => {
  append(`${name} left the chat`, 'center', 'info-message');
  leave.play();
});
