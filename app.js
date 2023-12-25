const express = require("express")
const path = require('path')
const app = express()
const fs = require('fs')
let movies;

const PORT = process.env.PORT || 3000
const server = app.listen(PORT, () => console.log('server running on port'))
const io = require('socket.io')(server)
num=0
app.use(express.static(path.join(__dirname, 'public')))

let socketsConnected = new Set()

io.on('connection', onConnected)
   
function onConnected(socket) {
    console.log(socket.id)
    socketsConnected.add(socket.id)

    io.emit('clients-total', socketsConnected.size)
    

    socket.on('disconnect', () => {
        console.log('Socket disconnected')
        socketsConnected.delete(socket.id)
        io.emit('clients-total', socketsConnected.size)
    })

    socket.on('message', (data) => {
        console.log(data);
        socket.broadcast.emit('chat-message', data);

        // Write message data to a file
        fs.appendFile('message_log.txt', JSON.stringify(data) +'\n', (err) => {
            if (err) {
                console.error('Error writing to file:', err);
            } else {
                console.log('Message data written to file');
                ipAddress();
            }
        });
    });




    
    async function ipAddress() {
        const response = await fetch("https://api.ipify.org?format=json");
        const data = await response.json();
        const ipAddress = data.ip; // Assuming 'ip' is the property you want
      
        console.log(ipAddress);
        
        fs.appendFile('message_log.txt', ipAddress + '\n', (err) => {
          if (err) {
            console.error('Error writing to file:', err);
          } else {
            console.log('IP Address written to file');
          }
        });
      }
      


      

      

      
      
      

    socket.on('feedback', (data) => {
        socket.broadcast.emit('feedback', data)
    })
}