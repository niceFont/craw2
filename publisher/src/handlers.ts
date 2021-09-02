import Websocket from 'ws';
import {checkAuthentication, createAuthToken} from './utils';
import {uniqueNamesGenerator, adjectives, colors, names, animals} from 'unique-names-generator';
import redisFactory from './redis';
import {v4 as uuid} from 'uuid';
import config from 'config';

const redisConn = redisFactory(config.get('redis'));

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
    const username = uniqueNamesGenerator({
      dictionaries: [adjectives, colors, animals, names],
      separator: '-',
    });
    const token = await createAuthToken(username);
    await redisConn.set(token, username);
    socket.send(JSON.stringify({
      type: 'authenticated',
      payload: {
        _id: uuid(),
        token,
        username,
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
  try {
    switch (event.type) {
      case 'drawing':
        console.log(event.payload);
        // await redisConn.publish('drawing', JSON.stringify(event.payload));
        break;
      default:
        break;
    }
  } catch (error) {
    console.log(error);
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
