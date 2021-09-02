import React, {useState, useEffect} from 'react';
import DrawingBoard from './components/DrawingBoard';
import {LocalUser} from './types';
import {useSetRecoilState} from 'recoil';
import {user, connectedSocket} from './store/atoms';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';


const Board = () => {
  const [localUser, setLocalUser] = useState<LocalUser>();
  const setSocket = useSetRecoilState(connectedSocket);
  const setUser = useSetRecoilState(user);
  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8000?key=528fad72-6335-413a-bc49-0674f3801a99');
    ws.addEventListener('open', () => {
      console.log('connection established');
      ws.send(JSON.stringify({type: 'authenticate', payload: null}));
    });


    ws.addEventListener('message', (message) => {
      const {payload} = JSON.parse(message.data);

      setUser({
        id: payload._id,
        username: payload.username,
        token: payload.token,
        email: '',
        isLoggedIn: true,
        guest: false,
      });
      setLocalUser({
        _id: payload._id,
        username: payload.username,
        token: payload.token,
        lastX: 0,
        lastY: 0,
        thickness: 5,
        color: '#000000',
      } as LocalUser);
    });
    setSocket(() => ws);
  }, []);
  return (
    <Router>
      <Switch>
        <Route path="/">
          {localUser && (
            <>
              <h1>{localUser.username}</h1>
              <DrawingBoard localUser={localUser}/>
            </>
          )}
        </Route>
      </Switch>
    </Router>
  );
};

export default Board;
