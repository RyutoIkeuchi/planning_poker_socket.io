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
		io.to(data.room_id).emit('res_add_user', data);
	});

	socket.on('send_selected_number_card', (data) => {
		console.log('他のユーザーが選んだ番号が送信されました', data);

		io.emit('res_selected_number_card', data);
	});

	socket.on('send_agenda_title', (data) => {
		console.log('ホストユーザーが書いたタイトルが送信されました', data);

		io.emit('res_agenda_title', data);
	});

	socket.on('send_poker_status',(data) => {
		console.log('ホストユーザーから選ばれたカードの状態が送信されました',data);

		io.emit('res_poker_status',data);
	})

	socket.on('disconnect', () => {
		console.log('クライアントとの接続が切れました');
	});
});

server.listen(PORT, () => console.log(`server ${PORT}`));
