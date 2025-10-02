import './App.css'
import Chatbox from './components/Chatbox'
import Room from './components/Room'
import { Routes, Route, Navigate } from "react-router-dom";
import { useRoomJoinedStore, useThemeStore } from './store';
import Theme from './components/Theme';
import { useEffect } from 'react';


function App() {
  const { roomJoined } = useRoomJoinedStore();
  const {isDark} = useThemeStore();   

  useEffect(() => {
    if (isDark) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
    }
  }, [isDark]);
  
  return (
    <>
      <Theme />
      <Routes>
        <Route path="/" 
          element= {!roomJoined && <Room />} />

        <Route path="/room/:roomCode" 
          element= {roomJoined ? <Chatbox /> : <Navigate to="/" replace />} />
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}

export default App
