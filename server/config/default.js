require('dotenv');
module.exports = {
  'http': {
    'passphrase': process.env.PASSPHRASE,
  },
  'redis': {
    'url': process.env.REDIS_CONN_URL,
  },
};
