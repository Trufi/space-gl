const socket = new WebSocket('ws://127.0.0.1:8870');
socket.binaryType = 'arraybuffer';

socket.onopen = function() {
    console.log('send');
    socket.send(new Float32Array([1, 2, 3]).buffer);
};
