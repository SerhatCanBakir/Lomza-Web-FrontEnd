# 📡 Real-Time Chat Application Frontend

This project is the **frontend** counterpart of the real-time chat application backend. Built using **React.js**, it provides a user-friendly interface for features like user authentication, group chats, friend requests, and real-time messaging.

---

## 🚀 Features

- **User Authentication**: Login and register forms for seamless user access.
- **Real-Time Messaging**: Instant updates for messages and notifications.
- **Group Chats**:
  - Create and manage chat rooms.
  - View and manage group members.
- **Friend Management**:
  - Send, accept, and decline friend requests.
  - View all friends and manage connections.
- **Responsive Design**: Optimized for both desktop and mobile devices.

---

## 🛠️ Technologies Used

- **React.js**: Core library for building the user interface.
- **fetch**: For API communication with the backend.
- **React Router**: For managing navigation and routes.
- **Socket.IO Client**: For real-time WebSocket communication.
- **CSS/SCSS**: For styling components.

---

## 🗂️ Project Structure

```bash
Lomza-Web-FrontEnd/
├── public/
│   ├── index.html
│   └── ...
├── src/
│   ├── authComp/
│   │   ├── LoginComp.js
│   │   ├── RegisterComp.js
│   │   ├── LoginComp.css
│   │   ├── RegisterComp.css
│   │   └── ...
│   ├── chatComp/
│   │   ├── ChatMessageInput.js
│   │   ├── ChatMessageList.js
│   │   ├── ChatWindowComp.js
│   │   ├── EmojiPickerComp.js
│   │   ├── MessageInput.css
│   │   ├── MessageList.css
│   │   └── ...
│   ├── friendsComp/
│   │   ├── AddFriendComp.js
│   │   ├── FriendListComp.js
│   │   ├── FriendListComp.css
│   │   ├── GroupAndFriendsManager.css
│   │   └── ...
│   ├── socketComp/
│   │   ├── socketComp.js
│   │   └── ...
│   ├── App.js
│   ├── index.js
│   ├── index.css
│   ├── reportWebVitals.js
│   ├── setupTests.js
│   ├── package.json
│   ├── .gitignore
│   └── README.md
```

---

## 📦 How to Run the Project

1. Clone the repository:
   ```bash
   git clone https://github.com/SerhatCanBakir/Lomza-Web-FrontEnd.git
   cd Lomza-Web-FrontEnd
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open the application in your browser:
   - [http://localhost:3000](http://localhost:3000)

---

## 🔗 Backend Integration

This frontend is designed to work seamlessly with the **Real-Time Chat Application Backend**. Ensure the backend is running and accessible at the correct endpoint for API communication.

- Backend Repository: [GitHub Backend Link](https://github.com/SerhatCanBakir/LomzaWebBackEnd)
- API Endpoints Used:
  - **Authentication**: `/login`, `/register`
  - **Friends**: `/friends`, `/addfriend/:id`
  - **Groups**: `/groups/creategroup`, `/groups/:id/addmember`
  - **Messages**: WebSocket events like `joinRoom`, `send-Messages`

---



## 📩 Contact

If you have any questions or suggestions, feel free to reach out:

- GitHub: [SerhatCanBakir](https://github.com/SerhatCanBakir)
- Email: [serhat2534serhat@outlook.com](mailto:serhat2534serhat@outlook.com)
