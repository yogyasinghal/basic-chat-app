const socket = io('http://localhost:3000');

const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp')
const messageContainer = document.querySelector(".container")
// const active = document.querySelector('.active-users');

var audio = new Audio('messageTone.mp3');

const append = (message, position)=>{
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
    if(position =='left'){ 
        audio.play();
    }
}

// const activeUser = (name)=>{
//     const userElement = document.createElement('span');
//     userElement.innerText = name;
//     active.append(userElement);
// }


const name = prompt("Enter your name to join");
socket.emit('new-user', name);


socket.on('user-joined', name =>{
    console.log("user joined at client");
    append(`${name} joined the chat`, 'right');
    // activeUser(name);
})


socket.on('receive', data =>{
    append(`${data.name}: ${data.message}`, 'left')
})

socket.on('left', name =>{
    append(`${name} left the chat`, 'right')
})


form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput.value;
    append(`You: ${message}`, 'right');
    socket.emit('send', message);
    messageInput.value = ''
})