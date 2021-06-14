import Websocket from 'ws';
import {checkAuthentication, createAuthToken} from './utils';

interface Message {
  type: string,
  payload: object | undefined | null
}
interface AuthenticatedMessage extends Message{
  authToken: string
}

const onMessageHandler = async function(data : string, socket : Websocket) {
  const event : Message = JSON.parse(data);

  if (event.type === 'authenticate') {
    const token = await createAuthToken('test');
    socket.send(JSON.stringify({
      type: 'authenticated',
      payload: {
        token,
      },
    }));
    return;
  }
  const authenticatedEvent : AuthenticatedMessage = event as AuthenticatedMessage;
  const isAuthenticated = await checkAuthentication(authenticatedEvent.authToken);
  if (!isAuthenticated) {
    socket.terminate();
    return;
  }
  switch (event.type) {
    default:
      break;
  }
};


const onCloseHandler = (_event : Websocket.CloseEvent) => {
  console.log('Connection closed');
};

const onErrorHandler = (error : Websocket.ErrorEvent) => {
  console.log('Error: ', error.message);
};

export default (socket : Websocket ) => {
  socket.on('message', (data : string) => onMessageHandler.call(null, data, socket));
  socket.on('close', onCloseHandler);
  socket.on('error', onErrorHandler);
};
