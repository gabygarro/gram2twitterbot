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

export const uploadPhotoToTwitter = async (done, filename, message_id) => {
  console.log(`[${new Date().toUTCString()} - ${message_id}]: Starting twitter upload`);
  const mediaIds = await Promise.all([
    client.v1.uploadMedia(filename)
  ]);
  await client.v1.tweet('', { media_ids: mediaIds });
  done();
  console.log(`[${new Date().toUTCString()} - ${message_id}]: Sent tweet`);
};
