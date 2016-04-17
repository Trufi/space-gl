import ws from 'ws';

let wss;

export function init(server) {
    wss = new ws.Server({server: server});

    wss.on('connection', onConnection);
}

function onConnection(ws) {
    console.log('new connection');

    ws.on('message', onMessage);
}

function onMessage(message, flags) {
    console.log('message', message);
    console.log('flags', flags);
    console.log(new Float32Array(new Uint8Array(message).buffer));
}
