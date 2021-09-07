import React, {useState, useEffect} from 'react';
import DrawingBoard from './components/DrawingBoard';
import {useSetRecoilState, useRecoilValue} from 'recoil';
import {userAtom, connectedSocketAtom, tokenAtom} from './store/atoms';


const Board = () => {
  const setSocket = useSetRecoilState(connectedSocketAtom);
  const user = useRecoilValue(userAtom);
  const setToken = useSetRecoilState(tokenAtom);
  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8000?key=528fad72-6335-413a-bc49-0674f3801a99');
    ws.addEventListener('open', () => {
      console.log('connection established');
      ws.send(JSON.stringify({type: 'authenticate', payload: null}));
    });


    ws.addEventListener('message', (message) => {
      const {payload} = JSON.parse(message.data);

      setToken(payload.token);
    });
    setSocket(() => ws);
  }, []);
  return (
    <>
      <h1>{user?.username}</h1>
      <DrawingBoard settings={{color: '#000000', thickness: 5}} />
    </>
  );
};

export default Board;
