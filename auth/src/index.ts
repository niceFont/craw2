import 'reflect-metadata';
import express from 'express';
import injectDependencies from './middlewares/injectDependencies';
import {assert, StructError} from 'superstruct';
import {User} from './entity/User';
import UserValidation from './validation/user';
import redis from 'redis';
import session from 'express-session';
import connectRedis from 'connect-redis';
import cors from 'cors';
import config from 'config';
import helmet from 'helmet';

const RedisStore = connectRedis(session);
const redisClient = redis.createClient(config.get('redis.options'));
const app = express();

const sess : session.SessionOptions = {
  store: new RedisStore({client: redisClient}),
  saveUninitialized: false,
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

app.use(session(sess));
app.use(helmet());
app.use(cors({
  origin: config.get('origins'),
}));
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

  const repo = req.DbConnection.getRepository(User);
  const user = await repo.findOne({
    select: ['username', 'email', 'password'],
    where: {
      username: req.body.username,
    },
  });
  if (!user) {
    res.status(403).send('Unauthorized');
    return;
  }

  const isSamePassword = await user.comparePassword(req.body.password);

  if (!isSamePassword) {
    res.status(403).send('Unauthorized');
    return;
  }
  // @ts-ignore
  req.session.key = user.email;

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
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      res.status(400).send('DUPLICATE_ENTRY');
      return;
    }
    res.status(500).send();
  }
});

app.listen(8080);
