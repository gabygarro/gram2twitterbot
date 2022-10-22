import fs from 'fs';
import TelegramBot, { Message } from 'node-telegram-bot-api';
import downloadPhotoQueue from './downloadPhotoQueue';
import { uploadPhotoToTwitter } from './tweet';

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TWITTER_PIC_SIZE_LIMIT = 5000000; // 5MB
const WAIT_PERIOD = 60000; // 1 min
const photo_name = "photo.bin";
const FORWARDING_CHAT_ID: number = Number(process.env.FORWARDING_CHAT_ID || 0);

downloadPhotoQueue.process(async ({ data: { file_id } }, done) => {
    try {
      console.log(`[${new Date().toUTCString()} - ${file_id}]: Starting photo download`);
      const fileWriter = fs.createWriteStream(photo_name);
      const stream = bot.getFileStream(file_id);
      stream.on('data', (chunk) => {
        fileWriter.write(chunk);
      });
      stream.on('error', (err) => {
        console.log(err);
        done(err);
      });
      stream.on('end', () => {
        console.log(`[${new Date().toUTCString()} - ${file_id}]: Finished downloading photo`);
        uploadPhotoToTwitter(done, photo_name, file_id);
      });
    } catch (error) {
      console.log(error);
      done(error);
    }
  });

const bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { polling: true });

bot.on('channel_post', (message: Message) => {
    const { message_id, photo, sender_chat } = message;
    if (!photo) return;
    const file_id = photo[photo.length -1].file_id;
    console.log(`[${new Date().toUTCString()} - ${file_id}]: Photo was uploaded to channel`);
    setTimeout(async () => {
        try {
            // Check if the message containing the photo was deleted by trying to forward it
            await bot.forwardMessage(FORWARDING_CHAT_ID, sender_chat.id, message_id);
            downloadPhotoQueue.add({ file_id });
        } catch (error) {
            console.log(`[${new Date().toUTCString()} - ${file_id}]: Photo was deleted before wait period`);
        }
    }, WAIT_PERIOD);
});
