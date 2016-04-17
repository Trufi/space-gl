const ws = new WebSocket('ws://127.0.0.1:8870');

ws.addEventListener('open', () => {
    console.log('send');
    ws.send(new Float32Array([1, 2, 3]).buffer);
});
