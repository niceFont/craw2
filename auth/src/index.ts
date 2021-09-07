import 'reflect-metadata';
import express from 'express';
import injectDependencies from './middlewares/injectDependencies';
import {assert, StructError} from 'superstruct';
import User from './entity/User';
import UserValidation from './validation/user';
import redis from 'redis';
import session from 'express-session';
import connectRedis from 'connect-redis';
import cors from 'cors';
import config from 'config';
import helmet from 'helmet';
import {v4 as uuid} from 'uuid';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import {promisify} from 'util';

const RedisStore = connectRedis(session);
const redisClient = redis.createClient(config.get('redis.options'));
const app = express();

const sess : session.SessionOptions = {
  store: new RedisStore({client: redisClient, ttl: 604800, disableTouch: true}),
  saveUninitialized: true,
  secret: config.get('session.secret'),
  resave: false,
  cookie: {secure: config.get('session.cookieSecure')},
};

const SecureRouteHandler = (req : express.Request, res : express.Response, next :express.NextFunction) => {
  // @ts-ignore
  if (!req.session.key) {
    return res.status(403).send('Unauthorized');
  }

  return next();
};

const redisGet = promisify(redisClient.get).bind(redisClient);
const redisExpire = promisify(redisClient.expire).bind(redisClient);

app.use(cors({
  credentials: true,
  origin: config.get('origins'),
}));
app.use(morgan('combined'));
app.use(cookieParser(config.get('session.secret')));
app.use(session(sess));
app.use(helmet());
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(injectDependencies);

app.post('/login', async (req, res) => {
  try {
    assert(req.body, UserValidation.login);
  } catch (error) {
    const {message} = error as StructError;
    res.status(400).send(message);
    return;
  }
  console.log(req.sessionID);
  const repo = req.DbConnection.getRepository(User);
  const user = await repo.findOne({
    select: ['id', 'username', 'email', 'password'],
    where: {
      username: req.body.username,
    },
  });
  if (!user) {
    res.status(403).json({message: 'UNAUTHORIZED'});
    return;
  }

  const isSamePassword = await user.comparePassword(req.body.password);

  if (!isSamePassword) {
    res.status(403).json({message: 'UNAUTHORIZED'});
    return;
  }
  // @ts-ignore
  req.session.key = {email: user.email, username: user.username, id: user.id, guest: false};
  req.cookies.sid = req.sessionID;

  if (!req.body.remember) {
    console.log('HERe', req.body);
    await redisExpire(`sess:${req.sessionID}`, 86400);
  } else {
    req.session.save((err) => console.log(err));
  }

  res.status(204).send();
});

app.get('/', (_req, res) => {
  res.send('healthy');
});

app.get('/secure', SecureRouteHandler, (_req, res) => {
  res.send('authenticated');
});

app.post('/signup', async (req : express.Request, res : express.Response) => {
  try {
    assert(req.body, UserValidation.signUp);
  } catch (error) {
    const {message} = error as StructError;
    res.status(400).send(message);
    return;
  }

  try {
    const user = new User(req.body);
    const repo = req.DbConnection.getRepository(User);
    await repo.save(user);
    res.status(204).send();
  } catch (error : unknown) {
    if (error instanceof StructError) {
      if (error.code === 'ER_DUP_ENTRY') {
        res.status(400).json({message: 'DUPLICATE_ENTRY'});
        return;
      }
      res.status(500).json();
    }
  }
});

app.post('/guest', async (req : express.Request, res : express.Response) => {
  // @ts-ignore
  req.session.key = {id: uuid(), guest: true};

  await redisExpire(`sess:${req.sessionID}`, 86400);
  res.status(204).send();
});

app.post('/logout', async (req : express.Request, res : express.Response) => {
  req.session.destroy((err : Error) => {
    if (err) {
      console.log(err);
      res.status(500).send('Internal Server Error');
    } else {
      res.status(204).send();
    }
  });
});

app.get('/me', async (req : express.Request, res : express.Response) => {
  const session = JSON.parse(await redisGet(`sess:${req.sessionID}`) || '{}');

  if (!session) {
    res.status(403).json({message: 'UNAUTHORIZED'});
  } else {
    console.log(req.sessionID);
    if (session.key) {
      res.json({
        id: session.key.id,
        email: session.key.email,
        name: session.key.name,
        username: session.key.username,
        guest: session.key.guest,
      });
    }
  }
});

app.listen(8080);
