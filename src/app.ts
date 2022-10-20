import Twitter from 'twitter-api-v2';

const TWITTER_API_KEY = process.env.TWITTER_API_KEY;
const TWITTER_API_KEY_SECRET = process.env.TWITTER_API_KEY_SECRET;
const TWITTER_ACCESS_TOKEN = process.env.TWITTER_ACCESS_TOKEN;
const TWITTER_ACCESS_TOKEN_SECRET = process.env.TWITTER_ACCESS_TOKEN_SECRET;

const client = new Twitter({
  appKey: TWITTER_API_KEY,
  appSecret: TWITTER_API_KEY_SECRET,
  accessToken: TWITTER_ACCESS_TOKEN,
  accessSecret: TWITTER_ACCESS_TOKEN_SECRET,
});

client.v2.tweet('Test tweet');
