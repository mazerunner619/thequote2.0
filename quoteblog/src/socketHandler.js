import socketClient from 'socket.io-client'
let socket = null;

export const socketInit = async(userRes) => {
    // socket = await socketClient('https://thequoteblog.herokuapp.com/', { transports : ['websocket']});
    socket = socketClient();
}

export default socket;

