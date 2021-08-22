require('dotenv').config();
import Websocket from 'ws';
import registerEventHandlers from './handlers';
import {Agent, IncomingMessage, ServerResponse, createServer} from 'http';
import url from 'url';
const ALLOWED_ORIGINS = process.env.NODE_ENV === 'production' ? process.env.ALLOWED_ORIGINS : ['http://localhost:3000'];


const server = createServer((_req : IncomingMessage, res : ServerResponse) => {
  res.writeHead(200);
  res.end('healthy');
}).listen(8000);

// @ts-ignore
const wss = new Websocket.Server({server});


wss.on('connection', registerEventHandlers);

server.on('upgrade', (req : IncomingMessage, socket : Agent) => {
  console.log('hey');
  const key = new url.URL('http://www.somehost.com' + req.url || '').searchParams.get('key');
  const {origin} = req.headers;
  if (!origin || !key) {
    socket.destroy();
    return;
  }
  // CORS
  if (!ALLOWED_ORIGINS?.includes(origin)) {
    socket.destroy();
    return;
  }

  // Authorization
  if (key !== process.env.API_KEY) {
    socket.destroy();
    return;
  }
});
