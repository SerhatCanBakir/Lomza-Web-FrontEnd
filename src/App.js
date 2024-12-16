import LoginComp from './authComp/LoginComp';
import RegisterComp from './authComp/RegisterComp'
import ChatWindowComp from './chatComp/ChatWindowComp';
import FriendListComp from './friendsComp/FriendListComp.js'
import AddFriendComp from './friendsComp/AddFriendComp.js'
import {Route,Routes,BrowserRouter} from 'react-router-dom';


function App() {
  return (
    <BrowserRouter>
<Routes>
  <Route path='/' Component={LoginComp}></Route>
  <Route path='/register' Component={RegisterComp}></Route>
  <Route path='/chat/:id' Component={ChatWindowComp}></Route>
  <Route path='/selectchat' Component={FriendListComp}></Route>
  <Route path='/addfriend' Component={AddFriendComp}></Route>
</Routes>
</BrowserRouter>
  );
}

export default App;
