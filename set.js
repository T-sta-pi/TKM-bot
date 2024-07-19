const fs = require('fs-extra');
const { Sequelize } = require('sequelize');
if (fs.existsSync('set.env'))
    require('dotenv').config({ path: __dirname + '/set.env' });
const path = require("path");
const databasePath = path.join(__dirname, './database.db');
const DATABASE_URL = process.env.DATABASE_URL === undefined
    ? databasePath
    : process.env.DATABASE_URL;
module.exports = { session: process.env.SESSION_ID || 'eyJub2lzZUtleSI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiWU1LV3Ywdm4wOUhYb2ovS3NJSW1GYUN3MWNNZTJiVGQ1UTRubWE5Z1ZXYz0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoibktpNmVNSDVoUzJFemVDdFNYMDRwTVZISldPY1kyNHBtN0JpaUxrZDZnRT0ifX0sInBhaXJpbmdFcGhlbWVyYWxLZXlQYWlyIjp7InByaXZhdGUiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJhTnVJNmdYU2lGTkZLTjRIbENxd1pWdjkvM3FjTFVzVzRVcWpqRkFRRTBZPSJ9LCJwdWJsaWMiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJmSlFmODdUejJjckhxY0NCY1A3QmNMdjhPeXZvaWY0SWxzSWRzYUpIV2hVPSJ9fSwic2lnbmVkSWRlbnRpdHlLZXkiOnsicHJpdmF0ZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6ImdGTnVYYnp1M3I4OGU5d3B3bUVUUWZUTFBwdlNtM3htYXhtWlp6bjhwVk09In0sInB1YmxpYyI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IlVrdnp0bTNwWEJ2cnpvU2JVS2xGZGtGZEhOWVRWNWl5NFYzSDlIb29YaEU9In19LCJzaWduZWRQcmVLZXkiOnsia2V5UGFpciI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiOEIxaWJXekJNcStJeW9ITm9XYXZidEwzSmQ2VzlidnR6M1VYeG9rRXNHQT0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiVG0xZi82bzRNcGNJUGh4TTRPbHh2ZTZIYUxEbjl3Z2R6YTBKVFhKZnRFZz0ifX0sInNpZ25hdHVyZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6ImxvSkxwbVBOVDFWWGZjakRrcUNQVW1DQjdxOThNekxjaThXTjEwdldYMzE3cXEzdElVdXRlUUNqcFhWWUM3cmpDc2grcFJPNmF4biswdGVVbjJ4V2hnPT0ifSwia2V5SWQiOjF9LCJyZWdpc3RyYXRpb25JZCI6OTksImFkdlNlY3JldEtleSI6ImRxaW1vazhTZkswempVMDFBZkVUejlNWUZJU2gxRE9zZlVlekNScS9pajg9IiwicHJvY2Vzc2VkSGlzdG9yeU1lc3NhZ2VzIjpbXSwibmV4dFByZUtleUlkIjozMSwiZmlyc3RVbnVwbG9hZGVkUHJlS2V5SWQiOjMxLCJhY2NvdW50U3luY0NvdW50ZXIiOjAsImFjY291bnRTZXR0aW5ncyI6eyJ1bmFyY2hpdmVDaGF0cyI6ZmFsc2V9LCJkZXZpY2VJZCI6IlhrQ1MtRmVHUlhlaXJTa0dZdzRtcHciLCJwaG9uZUlkIjoiZmZhNDAyZmEtOGIyYS00MmQ1LThiNGUtYWFmNzkzYmJkODE3IiwiaWRlbnRpdHlJZCI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6Ilk3cDhueXdWZVE1VGdpSno1ZithMkJWRDlPYz0ifSwicmVnaXN0ZXJlZCI6ZmFsc2UsImJhY2t1cFRva2VuIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiSnFqbjdTMS85L2JITzE4Z1k5clpoZjdOcnpRPSJ9LCJyZWdpc3RyYXRpb24iOnt9LCJhY2NvdW50Ijp7ImRldGFpbHMiOiJDT3F2bXBFQ0VMdWI2YlFHR0FFZ0FDZ0EiLCJhY2NvdW50U2lnbmF0dXJlS2V5Ijoid0xJT0xXY2w4M3NwaEtuOFEzUHVteHFveEp6eFFRNFVhS1FtQ29sd2Vucz0iLCJhY2NvdW50U2lnbmF0dXJlIjoicitOSjJxMjVpMnZqRFJFQ2VpbFlFU3loMnAwbG1BTklxODBwNUtDNm11WVJBMDNQR1BnUUlqdG9Ia25mV1RsUytrdXU0NmhvZlZwNWFCSkZ5ZjgxQUE9PSIsImRldmljZVNpZ25hdHVyZSI6IitENWdySDVqMlNxbkhDdTRSRFNlOFN1OHl3UThCSlhMZDE4cVlnUEpRRE9iVVdQQjBYRy85U25VcnhZci9tS24rZE1qZXdESEpTMUVuaDFLcHA1M2lnPT0ifSwibWUiOnsiaWQiOiIyNjM3NzEzNTYwNjc6MTBAcy53aGF0c2FwcC5uZXQiLCJsaWQiOiIxNDAyMzk3OTIyNzk3OTU6MTBAbGlkIn0sInNpZ25hbElkZW50aXRpZXMiOlt7ImlkZW50aWZpZXIiOnsibmFtZSI6IjI2Mzc3MTM1NjA2NzoxMEBzLndoYXRzYXBwLm5ldCIsImRldmljZUlkIjowfSwiaWRlbnRpZmllcktleSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IkJjQ3lEaTFuSmZON0tZU3AvRU56N3BzYXFNU2M4VUVPRkdpa0pncUpjSHA3In19XSwicGxhdGZvcm0iOiJhbmRyb2lkIiwicm91dGluZ0luZm8iOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJDQXdJQWc9PSJ9LCJsYXN0QWNjb3VudFN5bmNUaW1lc3RhbXAiOjE3MjEzODg0ODgsImxhc3RQcm9wSGFzaCI6IjF5aElSQSIsIm15QXBwU3RhdGVLZXlJZCI6IkFBQUFBQnZaIn0=',
    PREFIXE: process.env.PREFIX || ".",
    OWNER_NAME: process.env.OWNER_NAME || "Cod3Uchiha",
    NUMERO_OWNER : process.env.OWNER_NUM || "263771356067",              
    AUTO_READ_STATUS: process.env.AUTO_READ_STATUS || "non",
    AUTO_DOWNLOAD_STATUS: process.env.AUTO_DOWNLOAD_STATUS || 'non',
    BOT : process.env.BOT_NAME || 'TKM bot',
    URL : process.env.BOT_MENU_LINKS || 'https://telegra.ph/file/e07a3d933fb4cad0b3791.jpg',
    MODE: process.env.PUBLIC_MODE || "yes",
    PM_PERMIT: process.env.PM_PERMIT || 'no',
    HEROKU_APP_NAME : process.env.HEROKU_APP_NAME,
    HEROKU_APY_KEY : process.env.HEROKU_APY_KEY ,
    WARN_COUNT : process.env.WARN_COUNT || '3' ,
    ETAT : process.env.PRESENCE || '',
    //GPT : process.env.OPENAI_API_KEY || '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',
    DP : process.env.STARTING_BOT_MESSAGE || "yes",
    TZ : process.env.TIME_ZONE || 'Etc/GMT',
    ADM : process.env.ANTI_DELETE_MESSAGE || 'no',
    BOOM_MESSAGE_LIMIT : process.env.BOOM_MESSAGE_LIMIT || 100,
    PORT : process.env.PORT || 8000,
    LINK : process.env.LINK || '',
    DATABASE_URL,
    DATABASE: DATABASE_URL === databasePath
        ? "postgresql://tkm:Aqi6tqwyv5IwDHncTtVi5XtMGZvfndDJ@dpg-cqahogtds78s739sl81g-a.oregon-postgres.render.com/takudzwa" : "postgresql://tkm:Aqi6tqwyv5IwDHncTtVi5XtMGZvfndDJ@dpg-cqahogtds78s739sl81g-a.oregon-postgres.render.com/takudzwa",
    /* new Sequelize({
     dialect: 'sqlite',
     storage: DATABASE_URL,
     logging: false,
})
: new Sequelize(DATABASE_URL, {
     dialect: 'postgres',
     ssl: true,
     protocol: 'postgres',
     dialectOptions: {
         native: true,
         ssl: { require: true, rejectUnauthorized: false },
     },
     logging: false,
}),*/
};
let fichier = require.resolve(__filename);
fs.watchFile(fichier, () => {
    fs.unwatchFile(fichier);
    console.log(`update ${__filename}`);
    delete require.cache[fichier];
    require(fichier);
});
