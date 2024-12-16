import { useEffect, useState } from 'react';
import ChatMessageList from './ChatMessageList';
import ChatMessageInput from './ChatMessageInput';
import { SocketProvider } from '../socketComp/socketComp';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';

function ChatWindowComp() {
    const navigate = useNavigate();
    const [roomId, setRoomId] = useState('ilkoda');
    const {id } = useParams()
    
const hendleNavigate = ()=>{
    navigate('/selectchat');
}
    useEffect(() => {
       
        setRoomId(id);   
        console.log('Current roomId:', roomId);
        
    }, [roomId]);

    return (
        <div className="chat-window-container">
            <div>
               <button onClick={(()=>hendleNavigate())}>return chat Selection</button>
            </div>
            <SocketProvider>
                {/* Mesaj listesi */}
                <div className="message-list-container">
                    <h1>messages</h1>
                    <ChatMessageList room={roomId} />
                </div>

                {/* Mesaj giriş alanı */}
                <div className="message-input-container">
                    <ChatMessageInput room={roomId} />
                </div>
            </SocketProvider>
        </div>
    );
}

export default ChatWindowComp;
