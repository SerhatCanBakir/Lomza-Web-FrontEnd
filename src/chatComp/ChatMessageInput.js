import React, { useEffect, useRef, useState } from 'react';
import EmojiPicker from './EmojiPickerComp';
import { useSocket } from '../socketComp/socketComp';
import { Buffer } from 'buffer';
import './MessageInput.css'; // CSS dosyasını ekleyin

function MessageInput({ room }) {
    const [message, setMessage] = useState('');
    const [roomId, setRoomId] = useState('');
    const [isPhoto, setIsPhoto] = useState(false);
    const [photoBuffer, setPhotoBuffer] = useState(null);
    const socket = useSocket();

    const fileInputRef = useRef(null);

    useEffect(() => {
        setRoomId(room);
    }, [room]);

    const handleSend = () => {
        if (isPhoto && photoBuffer) {
            sendMessage(photoBuffer);
            setPhotoBuffer(null);
            setIsPhoto(false);
        } else if (message.trim()) {
            sendMessage(message);
            setMessage('');
        }
    };

    const onSelectEmoji = (emoji) => {
        setMessage((prev) => prev + emoji);
    };

    const getCookie = (name) => {
        const value = `; ${document.cookie};`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    };

    const takeNameAndIdFromCookie = () => {
        const id = getCookie('id');
        const username = getCookie('username');
        return { userid: id, username };
    };

    const sendMessage = (msg) => {
        if (socket) {
            const sender = takeNameAndIdFromCookie();
            socket.emit('send-Messages', {
                chatId: roomId,
                sender,
                isPhoto,
                content: isPhoto ? msg.toString('base64') : msg,
            });
        }
    };

    const handlePhotoUpload = async (event) => {
        const file = event.target.files[0];
        if (file) {
            try {
                const arrayBuffer = await file.arrayBuffer();
                const bufferContent = Buffer.from(arrayBuffer);
                setPhotoBuffer(bufferContent);
                setIsPhoto(true);
            } catch (error) {
                console.error('Fotoğraf yükleme hatası:', error);
            }
        }
    };

    const triggerFileInput = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    return (
        <div className="message-input-container">
            <div className="emoji-picker-container">
                <EmojiPicker onSelectEmoji={onSelectEmoji} />
            </div>
            <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message"
            />
            <button onClick={handleSend}>Send</button>
            <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handlePhotoUpload}
                style={{ display: 'none' }}
            />
            <button onClick={triggerFileInput}>Add Photo</button>
        </div>
    );
}

export default MessageInput;
