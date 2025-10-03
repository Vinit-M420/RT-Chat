import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAlertStore, useRoomJoinedStore, useRoomStore } from "../store";
import { Share2 , X } from 'lucide-react';

const Room = () => {
    const { roomCode, setRoomCode, showRoomDiv, setShowRoomDiv } = useRoomStore();
    const {toggleAlert, setToggleAlert} = useAlertStore();
    const { setRoomJoined } = useRoomJoinedStore();
    const modalAlert = useRef(null);
    const navigate = useNavigate(); 

    function generateRoomCode(){
        const newRoomCode = Array.from({ length: 6 }, () => 
            String.fromCharCode(65 + Math.floor(Math.random() * 26))
        ).join('');

        setRoomCode(newRoomCode);
    };

    useEffect(() => {
        const showAlert = setTimeout(() => setToggleAlert(false), 3000);
        return () => clearTimeout(showAlert)
    }, [toggleAlert]);

    
    const handleAlertClose = () => {
        setToggleAlert(false);
    };

    return (
        <div className='flex flex-col justify-center items-center gap-5 h-screen
                        dark:bg-zinc-950 bg-neutral-100'>
            <h1 className='dark:text-neutral-100 md:text-6xl text-3xl font-semibold text-zinc-950'>
                Real Time Chat Room
            </h1>     
            <h2 className="w-lg text-center dark:text-neutral-100">
                Powered by Websocket, Typescript, React and NodeJS.
            </h2>
            <button 
                className='dark:bg-neutral-100 bg-zinc-950 text-neutral-100 dark:text-zinc-950
                    py-2 px-6 rounded-2xl font-semibold cursor-pointer transition duration-200
                  dark:hover:bg-gray-300 hover:bg-zinc-700'
                onClick={() => {
                    generateRoomCode();
                    setShowRoomDiv(true);
                }}>
                Create Room
            </button>

            {showRoomDiv && (
                <div className="border border-gray-500 rounded-xl bg-zinc-950 p-4 overflow-y-auto 
                                w-fit h-auto animate-[pop_0.3s_ease-out]">
                    <div className="flex gap-10">
                        <div className="flex gap-3 items-center">
                            <input minLength={0} maxLength={6} 
                                value={roomCode} autoFocus
                                className="md:text-4xl text-3xl tracking-widest font-semibold 
                                        text-gray-400 field-sizing-content uppercase"
                                onChange={(e) => setRoomCode(e.target.value.toUpperCase()) }>
                                        
                            </input>
                            <div onClick={() => {
                                navigator.clipboard.writeText(window.location.href + `room/${roomCode}`);
                                setToggleAlert(true);
                                }}>
                            <Share2  className='text-gray-400 hover:text-gray-200 cursor-pointer'/>
                            </div>
                        </div>
                        <button className='bg-neutral-100 text-zinc-950 py-2 px-6 rounded-2xl font-semibold
                            transition duration-100 hover:bg-gray-200 cursor-pointer'
                            onClick={() => {
                                setRoomJoined(true);
                                navigate(`/room/${roomCode}`, { replace: true });
                            }}>
                            Join
                        </button>
                    </div>
                </div>
            )}

            {toggleAlert && (
            <div ref={modalAlert}
                role="alert"
                className="fixed inset-x bottom-6 left-6 mx-auto flex items-center justify-between 
                            p-4 text-sm text-zinc-950 bg-gray-200 rounded-lg w-fit max-w-xs shadow z-50">
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

export default Room;