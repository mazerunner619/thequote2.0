import socketClient from 'socket.io-client'
let socket = null;

export const socketInit = async(userRes) => {
    // socket = await socketClient('https://thequoteblog.herokuapp.com/', { transports : ['websocket']});
    socket = await socketClient('http://localhost:5000/', { transports : ['websocket']});
    socket.on("connect", ()=>{
        socket.emit('useronline', userRes);
    });
}

export const socketDisconnect =  () => {
    if(socket)
    socket.disconnect();
}

export default socket;

