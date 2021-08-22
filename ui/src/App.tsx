/* eslint-disable require-jsdoc */
import React, {useState, useEffect} from 'react';
import Board from './Board';
import {LocalUser} from './types';
import {useSetRecoilState} from 'recoil';
import './App.css';
import {user, connectedSocket} from './store/atoms';


function App() {
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
    <div>
      {localUser && (
        <>
          <h1>{localUser.username}</h1>
          <Board localUser={localUser}/>
        </>
      )}
    </div>
  );
}

export default App;
