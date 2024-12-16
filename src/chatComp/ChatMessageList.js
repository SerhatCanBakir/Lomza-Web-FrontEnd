import React, { useEffect, useState } from 'react';
import { useSocket } from '../socketComp/socketComp';
import './MessageList.css';

function MessageList({ room }) {
    const [messages, setMessages] = useState([]);
    const socket = useSocket();

    function getCookie(name) {
        const value = `; ${document.cookie};`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    }

    useEffect(() => {
        if (socket) {
            console.log('Socket connected:', socket.id);
            socket.emit('joinRoom', room); // Odaya katıl
            socket.emit('GetAll', room);  // Tüm mesajları al

            const handleAllMessages = (msgs) => {
                console.log('AllMessages received:', msgs);
                setMessages(msgs || []);
            };

            const handleGetMessage = (msg) => {
                console.log('get-Message received:', msg);
                if (msg) {
                    setMessages((prevMessages) => [...prevMessages, msg]);
                }
            };

            socket.on('AllMessages', handleAllMessages);
            socket.on('get-Messages', handleGetMessage);
            socket.on('tick', (obj) => console.log(obj));

            return () => {
                socket.off('AllMessages', handleAllMessages);
                socket.off('get-Messages', handleGetMessage);
            };
        }
    }, [room, socket]);

    return (
        <div className="message-list-container">
            <ul className="message-list">
                {messages.map((msg, index) => (
                    <li
                        key={index}
                        className={`message-item ${
                            msg.senderId === getCookie('id') ? 'sent' : 'received'
                        }`}
                    >
                        <div className="message-header">
                            <h5 className="message-sender">{msg.senderName}</h5>
                            <span className="message-timestamp">
                                {new Date(msg.sendTime).toLocaleTimeString()}
                            </span>
                        </div>

                        {/* Fotoğraf veya mesaj içeriğini göster */}
                        {msg.isPhoto ? (
                            <img
                                src={`data:image/jpeg;base64,${msg.content}`}
                                alt="User Upload"
                                className="message-photo"
                            />
                        ) : (
                            <p className="message-content">{msg.content}</p>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default MessageList;
