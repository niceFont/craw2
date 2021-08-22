require('dotenv');

module.exports = {
  saltRounds: 10,
  session: {
    secret: 'adevelsecret',
    cookieSecure: false,
  },
  origins: ['*'],
  redis: {
    options: {
      url: process.env.REDIS_CONN_URL,
    },
  },
};
