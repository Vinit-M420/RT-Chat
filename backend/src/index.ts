import WebSocket = require("ws");

interface User {
    socket: WebSocket;
    room: string,
}

let allSockets : User[] = [];
let userCount = 0;
const ws = new WebSocket.WebSocketServer({ port: 8069 });


ws.on("connection", (socket) => {
    
    userCount += 1;
    // console.log("user connected #" , userCount);

    socket.on("message", (message) => {  
        const parsedMessage = JSON.parse(message.toString());
        if (parsedMessage.type == 'join'){
            // console.log("socket pushed");
            allSockets.push({
                socket: socket, 
                room:  parsedMessage.payload.roomId
            });
            
        }
        if (parsedMessage.type == 'chat'){    
            let currentUserRoom = null;
            let currentSocketUser = socket;      

            for (let i=0; i < allSockets.length; i++){
                if (allSockets[i]?.socket == socket){
                    currentUserRoom = allSockets[i]?.room;
                    // console.log("currentUserRoom: "+ currentUserRoom);
                    // break;
                }
            }

            for (let i=0 ; i < allSockets.length; i++){
                if (allSockets[i]?.room == currentUserRoom && allSockets[i]?.socket !== currentSocketUser){
                    allSockets[i]?.socket.send(parsedMessage.payload.message)
                }
            }
        }
    })

    socket.on("disconnect", () => {
        allSockets = allSockets.filter(x => x.socket != socket)
    })
    
})