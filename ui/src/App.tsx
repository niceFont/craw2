/* eslint-disable require-jsdoc */
import React, {useState, useEffect} from 'react';
import Board from './Board';
import {LocalUser} from './types';
import './App.css';

function App() {
  const [localUser, setLocalUser] = useState<LocalUser>();
  useEffect(() => {
    const ws = new WebSocket('wss://localhost:8000?key=528fad72-6335-413a-bc49-0674f3801a99');
    ws.addEventListener('open', () => {
      console.log('connection established');
      ws.send(JSON.stringify({type: 'authenticate', payload: null}));
    });


    ws.addEventListener('message', (message) => {
      const {payload} = JSON.parse(message.data);
      setLocalUser({
        username: payload.username,
        token: payload.token,
        lastX: 0,
        lastY: 0,
        thickness: 10,
        color: '#000000',
      } as LocalUser);
    });
  }, []);
  return (
    <div className="App">
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
