const express = require('express');
const app = express();

const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server, {
	cors: {
		origin: ['http://localhost:3000'],
	},
});

const PORT = 4000;

io.on('connection', (socket) => {
	console.log('クライアントと接続しました');

	socket.on('join', (data) => {
		socket.join(data.room_id);
		io.to(data.room_id).emit('add_user_response', data);
	});

	socket.on('send_message', (data) => {
		console.log('受信', data);

		io.emit('message_response', data);
	});

	socket.on('disconnect', () => {
		console.log('クライアントとの接続が切れました');
	});
});

server.listen(PORT, () => console.log(`server ${PORT}`));
