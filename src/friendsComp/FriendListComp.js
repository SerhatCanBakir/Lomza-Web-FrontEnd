import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import './FriendListComp.css'; // CSS dosyasını import edin

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
}

export default function FriendListComp() {
  const navigate = useNavigate();
  const [friends, setFriends] = useState([]);

  const redirectToChat = (id) => {
    navigate(`/chat/${id}`);
  };

  useEffect(() => {
    fetch('http://localhost:433/getrooms', {
      method: 'GET',
      credentials: 'include', // Cookie'ler için gerekli
      headers: { 
          Accept: "application/json", 
          'Content-Type': 'application/json' ,
      }
    })
    .then(res => {
      if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
      }
      return res.json();
    })
    .then(data => {
      console.log('Data:', data);
      if (data) {
        setFriends(data.chats);
      } else {
        console.log('No data received');
      }
    })
    .catch(error => {
      console.error('Fetch error:', error);
    });
  }, []);

  console.log(friends);

  return (
    <div className="container">
      {friends.length > 0 ? (
        <>
          <h2>Friends</h2>
          <Link to='/addfriend'>Add Friend</Link>
          <ul>
            {friends.map((element, index) => (
              <li key={index}>
                {element.name + ' : '}
                <button onClick={() => { redirectToChat(element.chatId)}}>Chat</button>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <>
          <h1>HAHAHAHA NO FRIENDS</h1>
          <Link to='/addfriend'>Add Friend</Link>
        </>
      )}
    </div>
  );
}
