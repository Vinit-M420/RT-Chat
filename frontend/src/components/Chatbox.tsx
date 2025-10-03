import { useEffect, useRef, useState } from 'react'
import { Share2 , X, MessageSquareX, SendHorizontal  } from 'lucide-react';
import { useAlertStore, useRoomJoinedStore, useRoomStore } from '../store';
import { useNavigate } from "react-router-dom";

interface MsgInfo {
    message: string,
    isOwn: boolean
}

const Chatbox = () => {
    const [messages, setMessages] = useState<MsgInfo[]>([]);
    const { roomCode, setRoomCode, setShowRoomDiv } = useRoomStore();
    const {toggleAlert , setToggleAlert} = useAlertStore();
    const { setRoomJoined } = useRoomJoinedStore();
    const modalAlert = useRef(null);
    const wsRef = useRef<WebSocket | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();    
    
    useEffect(() => {
        setShowRoomDiv(false);

        const ws = new WebSocket("ws://localhost:8069")
        ws.onmessage = (event) => {
            setMessages(m => [...m, {message: event.data, isOwn: false}]);
        }
        wsRef.current = ws;

        ws.onopen = () => {
            ws.send(JSON.stringify({
                type: "join",
                payload: { roomId: roomCode }
            }))
        }

        return () => ws.close();
    }, [])


    function sendMessage(){
        const message = inputRef.current?.value;
        if (message === null || message?.length === 0 ){
            return alert("Please enter a valid message!");
        }
        //@ts-ignore
        setMessages(m => [...m, {message: message, isOwn: true} ]);
        
        wsRef.current?.send(JSON.stringify({
            type:"chat",
            payload: { message: message }
        }));

        if (inputRef.current) {
            inputRef.current.value = ""; 
        }
    }

    useEffect(() => {
        const showAlert = setTimeout(() => setToggleAlert(false), 3000);
        return () => clearTimeout(showAlert)
    }, [toggleAlert]);

     const handleAlertClose = () => {
        setToggleAlert(false);
    }


    return ( 
        <div className='bg-neutral-100 dark:bg-zinc-950 text-zinc-950 dark:text-neutral-100
                        flex flex-col justify-center items-center gap-5 min-h-screen
                        animate-[scaleIn_0.3s_ease-out_backwards]'>
            {roomCode && (
            <div className='flex flex-col justify-center items-center gap-2 md:pt-0 pt-5'>
                <h1 className='md:text-4xl text-3xl'>Real Time Chat Room</h1>
                <h3 className='text-xl dark:text-gray-400 text-zinc-950  dark:bg-black bg-white
                    border border-gray-400 p-2 rounded-2xl flex gap-4 items-center'>
                    Room Code:{" "}
                    <span className="flex gap-2 items-center">
                    <span className='dark:text-gray-200 text-gray-600'>{roomCode}</span>
                    <div onClick={() => {
                                navigator.clipboard.writeText(window.location.href);
                                setToggleAlert(true);
                            }}>
                        <Share2  className='cursor-pointer size-5 text-gray-500 hover:text-gray-900 
                            dark:text-gray-400 dark:hover:text-gray-100'/>
                    </div>
                    </span>
                </h3>
            </div>
            )}

            {/* Chat Box */}
            <div className='border border-gray-500 md:h-[500px] md:w-[700px] h-[400px] w-xs rounded
                        dark:bg-black bg-neutral-100 p-6 overflow-y-auto scroll-smooth scrollbar'>
                <div className='flex flex-col gap-2'>
                    {messages.map((msgInfo, index) => 
                    <div key={index} 
                        className={`dark:text-black dark:bg-white bg-black text-white 
                            py-1 px- w-fit rounded  ${msgInfo.isOwn ?  "ml-auto" : "mr-auto"}`}>
                        {msgInfo.message}
                    </div>
                    )}
                </div>
            </div>

        {/* Input Section */}            
        <div className='flex gap-5'>
            <input ref={inputRef} type="text" placeholder='Message ...' 
                className='border border-gray-500 rounded-xl dark:text-white dark:bg-black
                    dark:placeholder:text-gray-300 placeholder:text-gray-800 md:w-xl w-[250px] p-2' 
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()} />
            <div className='md:flex hidden'>
            <button className='dark:bg-white dark:text-black bg-black text-white 
                py-2 px-6 rounded-2xl font-semibold *:transition duration-100 
                dark:hover:bg-gray-200 hover:bg-gray-800 cursor-pointer'
                onClick={sendMessage}>
                <SendHorizontal />
            </button>
            </div>
            <div className='md:hidden flex'>
            <button className='dark:bg-white dark:text-black bg-black text-white 
                px-3 rounded-2xl font-semibold *:transition duration-100 
                dark:hover:bg-gray-200 hover:bg-gray-800 cursor-pointer'
                onClick={sendMessage}>
                <SendHorizontal />
            </button>
            </div>
        </div> 
        
        {/* Leave Chat Room Button */}
        <div className='absolute top-6 right-6'>
            <div className='flex items-center justify-between md:p-4 p-2 cursor-pointer text-sm
                border dark:text-white text-zinc-950 dark:border-gray-400 border-zinc-700
                rounded-2xl w-fit h-fit gap-2 transition duration-200 bg-neutral-100 hover:border 
              dark:hover:border-gray-300 dark:bg-black dark:hover:bg-zinc-800
              hover:border-zinc-800 hover:bg-neutral-200'
              onClick={() =>{
                setRoomCode('');
                setRoomJoined(false);
                navigate("/")   
            }}>
                <MessageSquareX className='size-'/>
                <span className='md:block hidden'>Leave Chat Room</span>
            </div>        
        </div>

        {/* Alert */}    
        {toggleAlert && (
            <div ref={modalAlert}
                role="alert"
                className="fixed inset-x bottom-6 left-6 mx-auto flex items-center justify-between 
                            p-4 text-sm text-black bg-gray-200 rounded-lg w-fit max-w-xs shadow z-50">
                <div className="flex items-center gap-2">
                    <svg className="w-4 h-4" aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20" >
                        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 
                                1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 
                                0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
                    </svg>
                    <span className="font-medium">Copied Room Link</span>
                    
                </div>
                
                <button onClick={handleAlertClose} className="ml-3">
                    <X className="size-3" />
                </button>
            </div>
            )}    
    </div>
    )
}

export default Chatbox;