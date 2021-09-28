import socketClient from "socket.io-client";
let socket;

export const createSocket = () => {
    socket = socketClient('http://localhost:5000/', { transports : ['websocket']});
    socket.on("connect", () => alert('conectde'))
}

export const disconnectSocket = () => {
    socket.emit("getoffline");
}

export const getonline = (user) => socket.emit('useronline', user);

