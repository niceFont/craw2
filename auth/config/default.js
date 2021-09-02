require('dotenv');

module.exports = {
  saltRounds: 10,
  session: {
    secret: 'adevelsecret',
    cookieSecure: false,
  },
  origins: ['*', 'http://localhost:3000'],
  redis: {
    options: {
      url: process.env.REDIS_CONN_URL,
    },
  },
};
