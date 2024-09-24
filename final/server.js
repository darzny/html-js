const express = require('express');
const path = require('path');
const http = require('http');
const WebSocket = require('ws');

const app = express();

app.use(express.static(path.join(__dirname, 'public')));

const server = http.createServer(app);

const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
    console.log('Новое WebSocket соединение');
  
    ws.on('message', (message) => {
        console.log(`Получено сообщение: ${message}`);
    
        const randomNum = Math.floor(Math.random() * 10) + 1;
        const randomWords = Array.from({ length: randomNum }, () => 'тест').join(' ');
    
        setTimeout(() => {
            ws.send(randomWords);
            console.log(`Отправлено сообщение: ${randomWords}`);
        }, 2000);
    });
  
    ws.on('close', () => {
        console.log('WebSocket соединение закрыто');
    });
  });

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));
app.get('/chat', (req, res) => res.sendFile(path.join(__dirname, 'public', 'chat.html')));
app.get('/contact', (req, res) => res.sendFile(path.join(__dirname, 'public', 'contact.html')));
app.get('/projects', (req, res) => res.sendFile(path.join(__dirname, 'public', 'projects.html')));
app.get('/skills', (req, res) => res.sendFile(path.join(__dirname, 'public', 'skills.html')));

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});
