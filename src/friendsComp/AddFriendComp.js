import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './GroupAndFriendsManager.css'; 
function getCookie(name) {
    const value = `; ${document.cookie};`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
}

function removeUnwantedPart(text, unwantedPart) {
    const parts = text.split('+');
    if (parts.length !== 2 || !parts.includes(unwantedPart)) {
        return text;
    }
    return parts.filter(part => part !== unwantedPart).join('');
}

const GroupAndFriendsManager = () => {
  const navigate = useNavigate();
  const [friends, setFriends] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const [friendIdToAdd, setFriendIdToAdd] = useState('');
  const [groupName, setGroupName] = useState('');
  const [selectedFriendsForGroup, setSelectedFriendsForGroup] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [groups, setGroups] = useState([]);

  // Yeni state'ler: Seçili grup, grup üyeleri ve gruba eklenecek arkadaş ID
  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const [groupMembers, setGroupMembers] = useState([]);
  const [friendIdToAddToGroup, setFriendIdToAddToGroup] = useState('');

  const token = getCookie('token');

  useEffect(() => {
    if (!token) {
      setError('Token bulunamadı. Lütfen giriş yapın.');
    }
  }, [token]);

  const authHeaders = {
    'Authorization': `Bearer ${token}`
  };

  const fetchFriendsAndRequests = async () => {
    if (!token) return; 
    setLoading(true);
    setError(null);

    try {
      const [requestsRes, friendsRes, groupRes] = await Promise.all([
        fetch('http://localhost:433/friendrequests', { headers: authHeaders }),
        fetch('http://localhost:433/friends', { headers: authHeaders }),
        fetch('http://localhost:433/groups', { headers: authHeaders })
      ]);

      if (!requestsRes.ok && requestsRes.status !== 404) {
        throw new Error('Arkadaş istekleri alınırken hata oluştu.');
      }

      if (!friendsRes.ok && friendsRes.status !== 404) {
        throw new Error('Arkadaş listesi alınırken hata oluştu.');
      }
      if(!groupRes.ok && groupRes.status !== 404){
        throw new Error('Gruplar alınırken hata oluştu.');
      }

      const requestsData = requestsRes.ok ? await requestsRes.json() : [];
      const friendsData = friendsRes.ok ? await friendsRes.json() : [];
      const groupData = groupRes.ok ? await groupRes.json() : [];

      setFriendRequests(Array.isArray(requestsData) ? requestsData : []);
      setFriends(Array.isArray(friendsData) ? friendsData : []);
      setGroups(Array.isArray(groupData) ? groupData : []);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Bilinmeyen bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFriendsAndRequests();
  }, [token]);

  const handleAddFriend = async () => {
    if (!friendIdToAdd) {
      alert("Lütfen eklenecek arkadaş ID'sini girin.");
      return;
    }

    try {
      const res = await fetch(`http://localhost:433/addfriend/${friendIdToAdd}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders
        },
        body: JSON.stringify({})
      });
      if (res.status === 201) {
        alert("Arkadaşlık isteği gönderildi!");
        setFriendIdToAdd('');
      } else if (res.status === 400) {
        alert("Eksik veri gönderildi!");
      } else {
        alert("Arkadaş eklenirken hata oluştu.");
      }
    } catch (err) {
      console.error(err);
      setError('Arkadaş eklerken hata oluştu.');
    }
  };

  const handleAcceptFriendRequest = async (requestId) => {
    try {
      fetch('/friendrequests/accept', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders
        },
        body: JSON.stringify({ id: requestId })
      }).then(res=>{
        if (res.status === 200) {
            alert("Arkadaş isteği kabul edildi!");
            fetchFriendsAndRequests();
          } else {
            alert("Arkadaş isteği kabul edilemedi!");
          }
        } 
      )
    } catch(err) {
      console.error(err);
      setError('Arkadaş isteği kabul edilirken hata oluştu.');
    }
  };

  const handleDeclineFriendRequest = async (requestId) => {
    try {
      const res = await fetch('http://localhost:433/friendrequests/decline', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders
        },
        body: JSON.stringify({ id: requestId })
      });
      if (res.status === 200) {
        alert("Arkadaş isteği reddedildi!");
        fetchFriendsAndRequests();
      } else {
        alert("Arkadaş isteği reddedilemedi!");
      }
    } catch (err) {
      console.error(err);
      setError('Arkadaş isteği reddedilirken hata oluştu.');
    }
  };

  const handleCreateGroup = async () => {
    if (!groupName || selectedFriendsForGroup.length === 0) {
      alert("Grup ismi ve en az bir arkadaş seçmelisiniz!");
      return;
    }

    try {
      const res = await fetch('http://localhost:433/groups/creategroup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders
        },
        body: JSON.stringify({
          groupName: groupName,
          users: [...selectedFriendsForGroup,getCookie('id')]
        })
      });
      if (res.status === 201) {
        alert("Grup başarıyla oluşturuldu!");
        setGroupName('');
        setSelectedFriendsForGroup([]);
        fetchFriendsAndRequests();
      } else if (res.status === 400) {
        alert("Eksik veya hatalı veri!");
      } else {
        alert("Grup oluşturulurken hata oluştu!");
      }
    } catch (err) {
      console.error(err);
      setError('Grup oluştururken hata oluştu.');
    }
  };

  const fetchGroupMembers = async (groupId) => {
    try {
      setLoading(true);
      console.log(groupId);
      setSelectedGroupId(groupId);
      const res = await fetch(`http://localhost:433/groups/${groupId}/members`, { headers: authHeaders });
      if (!res.ok) throw new Error('Grup üyeleri alınırken hata oluştu.');
      const members = await res.json();
      setGroupMembers(members);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Grup üyeleri alınırken hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveMember = async (userId) => {
    try {
      const res = await fetch(`http://localhost:433/groups/${selectedGroupId}/removemember`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders,
        },
        body: JSON.stringify({ userId }),
      });
      if (!res.ok) throw new Error('Üye gruptan çıkarılırken hata oluştu.');
      setGroupMembers((prev) => prev.filter((member) => member.id !== userId));
      alert('Üye gruptan çıkarıldı!');
    } catch (err) {
      console.error(err);
      setError(err.message || 'Üye gruptan çıkarılırken hata oluştu.');
    }
  };

  const handleSelectFriendForGroup = (friendId) => {
    if (selectedFriendsForGroup.includes(friendId)) {
      setSelectedFriendsForGroup(selectedFriendsForGroup.filter(chatId => chatId !== friendId));
    } else {
      setSelectedFriendsForGroup([...selectedFriendsForGroup, friendId]);
    }
  };

  const handleAddMemberToGroup = async () => {
    console.log('id : '+friendIdToAddToGroup);
    if (!friendIdToAddToGroup) {
      alert("Gruba eklenecek arkadaşın ID'sini giriniz!");
      return;
    }

    try {
      const res = await fetch(`http://localhost:433/groups/${selectedGroupId}/addmember`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders,
        },
        body: JSON.stringify({ userId: friendIdToAddToGroup }),
      });
      if (res.status === 201) {
        alert('Üye gruba başarıyla eklendi!');
        // Grubu tekrar çekerek üye listesini güncelleyebilirsiniz
        fetchGroupMembers(selectedGroupId);
        setFriendIdToAddToGroup('');
      } else {
        alert("Üye eklenirken hata oluştu!");
      }
    } catch (err) {
      console.error(err);
      setError('Üye eklenirken hata oluştu.');
    }
  };

  const handleRetrunSelection = ()=>{
    navigate('/selectchat');
  } 

  if (!token) {
    return <div>Lütfen giriş yapın. Token bulunamadı.</div>;
  }

  if (loading) {
    return <div>Yükleniyor...</div>;
  }

  return (
    <div className="container">
      {error && <p className="error">{error}</p>}
      <button onClick={handleRetrunSelection} className="return-button">return selection</button>
      
      <div className="header">
        <h2>id:{getCookie('id')}</h2>
      </div>
  
      <div className="section">
        <h2>Arkadaş İstekleri</h2>
        {friendRequests.length === 0 ? (
          <p>Arkadaş isteği bulunamadı.</p>
        ) : (
          <ul className="list">
            {friendRequests.map(req => (
              <li key={req.id}>
                {req.senderName} size arkadaşlık isteği gönderdi.
                <button onClick={() => handleAcceptFriendRequest(req._id)}>Kabul Et</button>
                <button onClick={() => handleDeclineFriendRequest(req._id)}>Reddet</button>
              </li>
            ))}
          </ul>
        )}
      </div>
  
      <div className="section">
        <h2>Arkadaşlar</h2>
        {friends.length === 0 ? (
          <p>Hiç arkadaşınız yok.</p>
        ) : (
          <ul className="list">
            {friends.map(friend => (
              <li key={friend.chatId}>
                {friend.name + '\nid : ' + removeUnwantedPart(friend.chatId,getCookie('id'))} 
                <label className="checkbox-group">
                  <input 
                    type="checkbox" 
                    checked={selectedFriendsForGroup.includes(removeUnwantedPart(friend.chatId,getCookie('id')))}
                    onChange={() => handleSelectFriendForGroup(removeUnwantedPart(friend.chatId,getCookie('id')))} 
                  /> (Grup için seç)
                </label>
              </li>
            ))}
          </ul>
        )}
      </div>
  
      <div className="section">
        <h3>Arkadaş Ekle</h3>
        <div className="form-group">
          <input 
            type="text" 
            placeholder="Arkadaş ID'si" 
            value={friendIdToAdd} 
            onChange={e => setFriendIdToAdd(e.target.value)} 
          />
          <button onClick={handleAddFriend}>Arkadaşlık İsteği Gönder</button>
        </div>
      </div>
  
      <div className="section">
        <h3>Grup Oluştur</h3>
        <div className="form-group">
          <input 
            type="text" 
            placeholder="Grup İsmi" 
            value={groupName} 
            onChange={e => setGroupName(e.target.value)} 
          />
          <button onClick={handleCreateGroup}>Grup Oluştur</button>
        </div>
      </div>
  
      <div className="section">
        <h2>Gruplar</h2>
        {groups.length === 0 ? (
          <p>Hiç grup bulunamadı.</p>
        ) : (
          <ul className="list">
            {groups.map((group) => (
              <li key={group.id}>
                <span>{group.name}</span>
                <button onClick={() => fetchGroupMembers(group.chatId )}>Üyeleri Görüntüle</button>
              </li>
            ))}
          </ul>
        )}
      </div>
  
      {selectedGroupId && (
        <div className="section">
          <h2>Grup Üyeleri</h2>
          {groupMembers.length === 0 ? (
            <p>Bu grupta hiç üye yok.</p>
          ) : (
            <ul className="list">
              {groupMembers.map((member) => (
                <li key={member._id}>
                  <span>{member.username} ({member._id})</span>
                  <button onClick={() => handleRemoveMember(member._id)}>Çıkar</button>
                </li>
              ))}
            </ul>
          )}
          <h3>Gruba Üye Ekle</h3>
          <div className="form-group">
            <input
              type="text"
              placeholder="Eklenecek arkadaşın ID'si"
              value={friendIdToAddToGroup}
              onChange={(e) => setFriendIdToAddToGroup(e.target.value)}
            />
            <button onClick={handleAddMemberToGroup}>Üye Ekle</button>
          </div>
        </div>
      )}
    </div>
  );
  
};

export default GroupAndFriendsManager;
