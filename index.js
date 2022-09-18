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
		io.to(data.room_id).emit('response_add_user', data);
	});

	socket.on('send_select_number', (data) => {
		console.log('他のユーザーが選んだ番号が送信されました', data);

		io.emit('response_select_number', data);
	});

	socket.on('send_agenda_title', (data) => {
		console.log('ホストユーザーが書いたタイトルが送信されました', data);

		io.emit('response_agenda_title', data);
	});

	socket.on('disconnect', () => {
		console.log('クライアントとの接続が切れました');
	});
});

server.listen(PORT, () => console.log(`server ${PORT}`));
