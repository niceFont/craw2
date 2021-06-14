require('dotenv').config();
import Websocket from 'ws';
import http2 from 'http2';
import fs from 'fs';
import registerEventHandlers from './handlers';
import {Agent, IncomingMessage} from 'http';
import url from 'url';
const ALLOWED_ORIGINS = process.env.NODE_ENV === 'production' ? process.env.ALLOWED_ORIGINS : ['http://localhost:3000'];

const server = http2.createSecureServer({
  key: fs.readFileSync('./cert/host.key'),
  cert: fs.readFileSync('./cert/host.cert'),
  allowHTTP1: true,
}, (_req : http2.Http2ServerRequest, res : http2.Http2ServerResponse) => {
  res.stream.respond({':status': 200});
  res.stream.end('healthy');
}).listen(8000);

// @ts-ignore
const wss = new Websocket.Server({server});


wss.on('connection', registerEventHandlers);

server.on('upgrade', (req : IncomingMessage, socket : Agent) => {
  const {key} = url.parse(req.url || '', true).query;
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
