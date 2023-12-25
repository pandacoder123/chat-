const socket = io()

const clientsTotal = document.getElementById('clients-total')

const messageContainer = document.getElementById('message-container')
const nameInput = document.getElementById('name-input')
const messageForm = document.getElementById('message-form')
const messageInput = document.getElementById('message-input')


function scrollToBottom() {
    var messageContainer = document.getElementById('message-container');
    messageContainer.scrollTop = messageContainer.scrollHeight;
}
  

messageContainer.classList.add('enlarged'); // Add the enlarged class

messageForm.addEventListener('submit', (e) => {
    e.preventDefault()
    sendMessage()
})

socket.on('clients-total', (data) =>{
    clientsTotal.innerText = 'Total Clients: '+(data);

})

function sendMessage() {
    if (messageInput === '') {return}
    // console.log(messageInput.value)
    const data = {
        name: nameInput.value,
        message: messageInput.value,
        datetime: new Date()}
        socket.emit('message', data);
        addMessageToUI(true, data)
        messageInput.value = ''
        scrollToBottom();
}

socket.on('chat-message', (data) => {
    addMessageToUI(false, data)
})

function addMessageToUI(isOwnMessage, data) {
    clearFeedback()
    const element = `
<li class="${isOwnMessage ? 'message-right' : 'message-left'}">
    <p class="message">
        ${data.message}
        <span>${data.name}</span>
    </p>
</li>`
console.log(isOwnMessage)
messageContainer.innerHTML += element;
}

window.onload = function() {
    scrollToBottom();
};

messageInput.addEventListener('focus', (e) => {
    socket.emit('feedback', {
        feedback: `${nameInput.value} is typing...`,
    })

})

messageInput.addEventListener('keypress', (e) => {
    socket.emit('feedback', {
        feedback: `${nameInput.value} is typing...`,
    })
})

messageInput.addEventListener('blur', (e) => {
    socket.emit('feedback', {
        feedback: ``,
    })
})

socket.on('feedback', (data) => {
    clearFeedback()
    const element = `<li class="message-feedback">
    <p class="feedback" id="feedback">${data.feedback}</p>
</li>`
messageContainer.innerHTML += element;
})

function clearFeedback() {
    document.querySelectorAll('li.message-feedback').forEach(element => {
        element.parentNode.removeChild(element)
    })
}

async function ipAdress() {
    const response = await fetch("https://api.ipify.org?format=json");
    const movies = await response.json();
    return(movies)
  }
  
