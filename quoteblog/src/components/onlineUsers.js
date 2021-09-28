// import React,{useState, useEffect} from 'react'
// import io from 'socket.io-client'
// import $ from 'jquery'

// const OnlineUsers = () => {

//     useEffect( ()=>{
//         const socket = io('http://localhost:5000');
//         alert(socket.id);
//         socket.on('connect', () => alert(`connected as ${socket.id}`));
//         socket.on('online', (data) => {
//             console.log(data);
//             $("#online-dash").append(`<li>${data}</li>`);
//         });
//         });
//     return (
//         <div>
//             <h1>online users</h1>
//             {/* <h2 id="myid"></h2> */}
//             <ul id="online-dash">

//             </ul>
//         </div>
//     )
// }

// export default OnlineUsers
