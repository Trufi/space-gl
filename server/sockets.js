import ws from 'ws';

let wss;

export function init(server) {
    wss = new ws.Server({server: server});

    wss.on('connection', onConnection);
}

function onConnection(socket) {
    console.log('new connection');

    socket.on('message', onMessage);
}

function onMessage(message) {
    console.log('message', message);
    console.log(new Float32Array(new Uint8Array(message).buffer));
}
