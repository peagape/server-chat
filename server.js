const net = require('net');

let clients = []; // Armazena todos os sockets conectados

const server = net.createServer((socket) => {
    console.log('Novo cliente conectado.');
    clients.push(socket);

    // Notificar todos que um novo cliente entrou
    broadcast('Um novo cliente entrou no chat.', socket);

    // Lidar com mensagens recebidas
    socket.on('data', (data) => {
        const message = data.toString().trim();
        console.log(`Mensagem recebida: ${message}`);
        broadcast(message, socket); // Retransmitir a mensagem para todos os clientes
    });

    // Lidar com desconexões
    socket.on('end', () => {
        console.log('Cliente desconectado.');
        clients = clients.filter((client) => client !== socket);
        broadcast('Um cliente saiu do chat.', socket);
    });

    // Lidar com erros
    socket.on('error', (err) => {
        console.error('Erro no cliente:', err.message);
    });
});

// Função para retransmitir mensagens
function broadcast(message, sender) {
    clients.forEach((client) => {
        if (client !== sender) {
            client.write(message + '\n');
        }
    });
}

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Servidor de chat rodando na porta ${PORT}`);
});
