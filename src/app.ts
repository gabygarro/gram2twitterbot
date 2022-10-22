import fs from 'fs';
import TelegramBot, { Message } from 'node-telegram-bot-api';
import downloadMediaQueue from './downloadMediaQueue';
import { uploadMediaToTwitter } from './tweet';

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const WAIT_PERIOD = 60000; // 1 min
const media_name = "file";
const FORWARDING_CHAT_ID: number = Number(process.env.FORWARDING_CHAT_ID || 0);

downloadMediaQueue.process(async ({ data: { file_id, message_id, mime_type } }, done) => {
    try {
      console.log(`[${new Date().toUTCString()} - ${message_id}]: Starting media download`);
      const fileWriter = fs.createWriteStream(media_name);
      const stream = bot.getFileStream(file_id);
      stream.on('data', (chunk) => {
        fileWriter.write(chunk);
      });
      stream.on('error', (err) => {
        console.log(err);
        done(err);
      });
      stream.on('end', () => {
        console.log(`[${new Date().toUTCString()} - ${message_id}]: Finished downloading media`);
        uploadMediaToTwitter(done, media_name, message_id, mime_type);
      });
    } catch (error) {
      console.log(error);
      done(error);
    }
  });

const bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { polling: true });

bot.on('channel_post', (message: Message) => {
    try {
        const { message_id, photo, video, sender_chat } = message;
        if (!photo && !video ) return;
        const file_id = photo ? photo[photo.length -1].file_id : video.file_id;
        console.log(`[${new Date().toUTCString()} - ${message_id}]: ${photo ? 'Photo' : 'Video'} was uploaded to channel`);
        setTimeout(async () => {
            try {
                // Check if the message containing the photo was deleted by trying to forward it
                await bot.forwardMessage(FORWARDING_CHAT_ID, sender_chat.id, message_id);
                downloadMediaQueue.add({ file_id, message_id, mime_type: video?.mime_type });
            } catch (error) {
                console.log(error);
                console.log(`[${new Date().toUTCString()} - ${message_id}]: Media was deleted before wait period`);
            }
        }, WAIT_PERIOD);
    } catch (error) {
        console.log(error);
    }
});
