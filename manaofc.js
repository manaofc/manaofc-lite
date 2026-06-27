const axios = require('axios');
const yts = require('yt-search');
const express = require('express');
const fs = require('fs-extra');
const path = require('path');
const { exec } = require('child_process');
const router = express.Router();
const pino = require('pino');
const moment = require('moment-timezone');
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
const mega = require('megajs');
const { File } = mega;

const megaAuth = {
    email: 'manishasasmitha27@gmail.com',
    password: 'manishasasmitha27@ms',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/12.246'
};

function randomMegaId(length = 6, numberLength = 4) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    const number = Math.floor(Math.random() * Math.pow(10, numberLength));
    return `${result}${number}`;
}

const uploadToMega = (data, name) => {
    return new Promise((resolve, reject) => {
        try {
            const storage = new mega.Storage(megaAuth, () => {
                data.pipe(storage.upload({ name: name, allowUploadBuffering: true }));
                storage.on('add', (file) => {
                    file.link((err, url) => {
                        if (err) throw err;
                        storage.close();
                        resolve(url);
                    });
                });
            });
        } catch (err) {
            reject(err);
        }
    });
};

const {
  default: makeWASocket,
  getAggregateVotesInPollMessage,
  useMultiFileAuthState,
  DisconnectReason,
  getDevice,
  fetchLatestBaileysVersion,
  jidNormalizedUser,
  getContentType,
  Browsers,
  makeInMemoryStore,
  makeCacheableSignalKeyStore,
  downloadContentFromMessage,
  generateWAMessageFromContent,
  prepareWAMessageMedia,
  generateForwardMessageContent,
  proto,
} = require("baileys");

// funtion
const getBuffer = async (url, options) => {
    try {
        options ? options : {}
        var res = await axios({
            method: 'get',
            url,
            headers: {
                'DNT': 1,
                'Upgrade-Insecure-Request': 1
            },
            ...options,
            responseType: 'arraybuffer'
        })
        return res.data
    } catch (e) {
        console.log(e)
    }
}

const getGroupAdmins = (participants) => {
    var admins = []
    for (let i of participants) {
        i.admin !== null ? admins.push(i.id) : ''
    }
    return admins
}

const getRandom = (ext) => {
    return `${Math.floor(Math.random() * 10000)}${ext}`
}

const h2k = (eco) => {
    var lyrik = ['', 'K', 'M', 'B', 'T', 'P', 'E']
    var ma = Math.log10(Math.abs(eco)) / 3 | 0
    if (ma == 0) return eco
    var ppo = lyrik[ma]
    var scale = Math.pow(10, ma * 3)
    var scaled = eco / scale
    var formatt = scaled.toFixed(1)
    if (/\.0$/.test(formatt))
        formatt = formatt.substr(0, formatt.length - 2)
    return formatt + ppo
}

const isUrl = (url) => {
    return url.match(
        new RegExp(
            /https?:\/\/(www\.)?[-a-zA-Z0-9@:%.+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%+.~#?&/=]*)/,
            'gi'
        )
    )
}

const Json = (string) => {
    return JSON.stringify(string, null, 2)
}

const runtime = (seconds) => {
    seconds = Number(seconds)
    var d = Math.floor(seconds / (3600 * 24))
    var h = Math.floor(seconds % (3600 * 24) / 3600)
    var m = Math.floor(seconds % 3600 / 60)
    var s = Math.floor(seconds % 60)
    var dDisplay = d > 0 ? d + (d == 1 ? ' day, ' : ' days, ') : ''
    var hDisplay = h > 0 ? h + (h == 1 ? ' hour, ' : ' hours, ') : ''
    var mDisplay = m > 0 ? m + (m == 1 ? ' minute, ' : ' minutes, ') : ''
    var sDisplay = s > 0 ? s + (s == 1 ? ' second' : ' seconds') : ''
    return dDisplay + hDisplay + mDisplay + sDisplay;
}

const sleep = async (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms))
}

const fetchJson = async (url, options) => {
    try {
        options ? options : {}
        const res = await axios({
            method: 'GET',
            url: url,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36'
            },
            ...options
        })
        return res.data
    } catch (err) {
        return err
    }
}

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
// Default config structure
const defaultConfig = {
    AUTO_VIEW_STATUS: 'true',
    AUTO_LIKE_STATUS: 'true',
    AUTO_RECORDING: 'true',
    AUTO_LIKE_EMOJI: ['💥', '👍', '😍', '💗', '🎈', '🎉', '🥳', '😎', '🚀', '🔥'],
    PREFIX: '.',
    MAX_RETRIES: 43,
    IMAGE_PATH: 'https://files.catbox.moe/i33owf.png',
    OWNER_NUMBER: '94759934522'
};

// Memory optimization: Throttle status handlers
function setupStatusHandlers(socket, userConfig) {
    let lastStatusInteraction = 0;
    const STATUS_INTERACTION_COOLDOWN = 10000; // 10 seconds
    
    socket.ev.on('messages.upsert', async ({ messages }) => {
        const message = messages[0];
        if (!message?.key || message.key.remoteJid !== 'status@broadcast' || !message.key.participant) return;
        
        // Throttle status interactions to prevent spam
        const now = Date.now();
        if (now - lastStatusInteraction < STATUS_INTERACTION_COOLDOWN) {
            return;
        }

        try {
            if (userConfig.AUTO_RECORDING === 'true' && message.key.remoteJid) {
                await socket.sendPresenceUpdate("recording", message.key.remoteJid);
            }

            if (userConfig.AUTO_VIEW_STATUS === 'true') {
                let retries = parseInt(userConfig.MAX_RETRIES) || 3;
                while (retries > 0) {
                    try {
                        await socket.readMessages([message.key]);
                        break;
                    } catch (error) {
                        retries--;
                        console.warn(`Failed to read status, retries left: ${retries}`, error);
                        if (retries === 0) throw error;
                        await delay(1000 * (parseInt(userConfig.MAX_RETRIES) || 3 - retries));
                    }
                }
            }

            if (userConfig.AUTO_LIKE_STATUS === 'true') {
                const emojis = Array.isArray(userConfig.AUTO_LIKE_EMOJI) ? 
                    userConfig.AUTO_LIKE_EMOJI : defaultConfig.AUTO_LIKE_EMOJI;
                const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
                let retries = parseInt(userConfig.MAX_RETRIES) || 3;
                while (retries > 0) {
                    try {
                        await socket.sendMessage(
                            message.key.remoteJid,
                            { react: { text: randomEmoji, key: message.key } },
                            { statusJidList: [message.key.participant] }
                        );
                        lastStatusInteraction = now;
                        console.log(`Reacted to status with ${randomEmoji}`);
                        break;
                    } catch (error) {
                        retries--;
                        console.warn(`Failed to react to status, retries left: ${retries}`, error);
                        if (retries === 0) throw error;
                        await delay(1000 * (parseInt(userConfig.MAX_RETRIES) || 3 - retries));
                    }
                }
            }
        } catch (error) {
            console.error('Status handler error:', error);
        }
    });
}

// Database helpers
const basePath = path.join(__dirname, "buttondata");

// Ensure base folder exists
if (!fs.existsSync(basePath)) {
  fs.mkdirSync(basePath);
}

// Helper: ensure folder exists
function ensureFolder(folder) {
  const folderPath = path.join(basePath, folder);
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath);
  }
}

// Helper: read JSON
function readJSON(folder, file, defaultData = []) {
  ensureFolder(folder);
  const filePath = path.join(basePath, folder, file);

  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(defaultData, null, 2));
    return defaultData;
  }

  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

// Helper: write JSON
function writeJSON(folder, file, data) {
  ensureFolder(folder);
  const filePath = path.join(basePath, folder, file);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// =========================================
// CMD STORE FUNCTIONS
// =========================================

async function updateCMDStore(MsgID, CmdID) {
  try {
    let olds = readJSON("Non-Btn", "data.json", []);
    olds.push({ [MsgID]: CmdID });
    writeJSON("Non-Btn", "data.json", olds);
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
}

async function isbtnID(MsgID) {
  try {
    let olds = readJSON("Non-Btn", "data.json", []);
    return olds.some((item) => item[MsgID]);
  } catch {
    return false;
  }
}

async function getCMDStore(MsgID) {
  try {
    let olds = readJSON("Non-Btn", "data.json", []);
    for (const item of olds) {
      if (item[MsgID]) {
        return item[MsgID];
      }
    }
    return null;
  } catch (e) {
    console.log(e);
    return null;
  }
}

function getCmdForCmdId(CMD_ID_MAP, cmdId) {
  const result = CMD_ID_MAP.find((entry) => entry.cmdId === cmdId);
  return result ? result.cmd : null;
}

// Command registry
const registeredCommands = [];

function cmd(info, func) {
  var data = info;
  data.function = func;
  if (!data.dontAddCommandList) data.dontAddCommandList = false;
  if (!info.desc) info.desc = '';
  if (!data.fromMe) data.fromMe = false;
  if (!info.category) data.category = 'misc';
  if (!info.filename) data.filename = "Not Provided";
  registeredCommands.push(data);
  return data;
}

//////////// COMMAND /////////////
// owner command 
cmd({
    pattern: "owner",
    desc: "Display owner contact information.",
    react: "🌝",
    use: ".owner",
    category: "owner",
    filename: __filename
},
async (conn, mek, m, { from, reply }) => {
    try {
        const vcard = 
            'BEGIN:VCARD\n' +
            'VERSION:3.0\n' +
            'FN:MANAOFC\n' +
            'ORG:MANAOFC\n' +
            'TEL;type=CELL;type=VOICE;waid=94759934522:+94759934522\n' +
            'EMAIL:manishasasmith27@gmail.com\n' +
            'END:VCARD';

        await conn.sendMessage(from, { 
            contacts: { 
                displayName: "manaofc", 
                contacts: [{ vcard }] 
            },  
            quoted: mek 
        });
    } catch (e) {
        console.error(e);
        reply('⚠️ An error occurred while fetching owner information.');
    }
});


// main command

// 📥 download command 📥

/* ================== SONG SEARCH ================== */
cmd(
  {
    pattern: "song",
    react: "🎵",
    alias: ["music", "yt"],
    category: "download",
    use: ".song <Song Name or YouTube URL>",
    filename: __filename,
  },
  async (socket, mek, m, { from, prefix, q, reply }) => {
    try {
      if (!q) return reply("❌ *Please provide a song name or YouTube URL!*");

      const search = await yts(q);
      if (!search.videos || search.videos.length === 0) {
        return reply("⚠️ *No song results found!*");
      }

      const song = search.videos[0];

      const caption = `

*🎶 MANISHA-MD-V6 SONG DOWNLOAD.📥*
╭──────────────────❥
│✨ \`Title\` : ${song.title}
│⏰ \`Duration\` : ${song.timestamp}
│👀 \`Views\` : ${song.views}
│ 📅 ‍ \`Uploaded\` : ${song.ago}
│ 📺 ‍ \`Channel\` : ${song.author.name}
╰──────────────────❥

> _*Powered By Manaofc*_ `;

      const buttons = [
        {
          buttonId: `${prefix}yta ${song.url}`,
          buttonText: { displayText: "AUDIO TYPE 🎙" },
          type: 1,
        },
        {
          buttonId: `${prefix}ytd ${song.url}`,
          buttonText: { displayText: "DOCUMENT TYPE 📁" },
          type: 1,
        },
      ];

      const buttonMessage = {
        image: song.thumbnail,
        caption: caption,
        footer: "> _Powered By Manaofc_",
        buttons: buttons,
        headerType: 4,
      };

      await socket.buttonMessage(from, buttonMessage, mek);
    } catch (e) {
      console.log(e);
      reply("❌ *An error occurred while searching!*");
    }
  }
);

/* ================== AUDIO DOWNLOAD ================== */

cmd(
  {
    pattern: "yta",
    react: "⬇️",
    dontAddCommandList: true,
    filename: __filename,
  },
  async (socket, mek, m, { from, q, reply }) => {
    try {
      if (!q) return reply("❌ *Need a YouTube URL!*");

      await socket.sendMessage(from, {
        react: { text: "⬇️", key: mek.key },
      });

      // Fetch API
      const res = await fetch(
        `https://api-dark-shan-yt.koyeb.app/download/ytmp3?url=${encodeURIComponent(q)}&apikey=d1e93aa8203b49d5`
      );

      const json = await res.json();

      if (!json.status || !json.data.download) {
        return reply("❌ *Failed to fetch audio!*");
      }

      // Send audio file
      await socket.sendMessage(
        from,
        {
          audio: { url: json.data.download },
          mimetype: "audio/mpeg",
          ptt: false,
        },
        { quoted: mek }
      );

      await socket.sendMessage(from, {
        react: { text: "✔️", key: mek.key },
      });

    } catch (e) {
      console.log(e);
      reply("❌ *Audio download failed!*");
    }
  }
);

/* ================== DOCUMENT DOWNLOAD ================== */

cmd(
  {
    pattern: "ytd",
    react: "⬇️",
    dontAddCommandList: true,
    filename: __filename,
  },
  async (socket, mek, m, { from, q, reply }) => {
    try {
      if (!q) return reply("❌ *Need a YouTube URL!*");

      await socket.sendMessage(from, {
        react: { text: "⬇️", key: mek.key },
      });

      // Fetch API
      const res = await fetch(
        `https://api-dark-shan-yt.koyeb.app/download/ytmp3?url=${encodeURIComponent(q)}&apikey=d1e93aa8203b49d5`
      );

      const json = await res.json();

      if (!json.status || !json.data.download) {
        return reply("❌ *Failed to fetch document link!*");
      }

      // Send as document
      await socket.sendMessage(
        from,
        {
          document: { url: json.data.download },
          mimetype: "audio/mpeg",
          fileName: `${json.data.title}.mp3`,
          caption: `🎵 *${json.data.title}*`,
        },
        { quoted: mek }
      );

      await socket.sendMessage(from, {
        react: { text: "✔️", key: mek.key },
      });

    } catch (e) {
      console.log(e);
      reply("❌ *Document download failed!*");
    }
  }
);

/* ================== VIDEO SEARCH ================== */
cmd(
  {
    pattern: "video",
    react: "🎬",
    alias: ["mp4", "ytv"],
    category: "download",
    use: ".video <video Name or YouTube URL>",
    filename: __filename,
  },
  async (socket, mek, m, { from, prefix, q, reply }) => {
    try {
      if (!q) return reply("❌ *Please provide a video name or YouTube URL!*");

      const search = await yts(q);
      if (!search.videos || search.videos.length === 0) {
        return reply("⚠️ *No video results found!*");
      }

      const video = search.videos[0];

      const caption = `

*🎬 MANISHA-MD-V6 VIDEO DOWNLOAD.📥*
╭──────────────────❥
│✨ \`Title\` : ${video.title}
│⏰ \`Duration\` : ${video.timestamp}
│👀 \`Views\` : ${video.views}
│ 📅 ‍ \`Uploaded\` : ${video.ago}
│ 📺 ‍ \`Channel\` : ${video.author.name}
╰──────────────────❥

> _*Powered By Manaofc*_ `;

      const buttons = [
        {
          buttonId: `${prefix}ytvv ${video.url}`,
          buttonText: { displayText: "VIDEO TYPE 🎬" },
          type: 1,
        },
        {
          buttonId: `${prefix}ytvd ${video.url}`,
          buttonText: { displayText: "DOCUMENT TYPE 📁" },
          type: 1,
        },
      ];

      const buttonMessage = {
        image: video.thumbnail,
        caption: caption,
        footer: "> _Powered By Manaofc_",
        buttons: buttons,
        headerType: 4,
      };

      await socket.buttonMessage(from, buttonMessage, mek);
    } catch (e) {
      console.log(e);
      reply("❌ *An error occurred while searching!*");
    }
  }
);

/* ================== VIDEO DOWNLOAD ================== */

cmd(
  {
    pattern: "ytvv",
    react: "⬇️",
    dontAddCommandList: true,
    filename: __filename,
  },
  async (socket, mek, m, { from, q, reply }) => {
    try {
      if (!q) return reply("❌ *Need a YouTube URL!*");

      // React loading
      await socket.sendMessage(from, {
        react: { text: "⬇️", key: mek.key },
      });

      // Fetch video API
      const res = await fetch(
        `https://api-dark-shan-yt.koyeb.app/download/ytmp4?url=${encodeURIComponent(q)}&quality=720&apikey=d1e93aa8203b49d5`
      );

      const json = await res.json();

      if (!json.status || !json.data.download) {
        return reply("❌ *Failed to fetch video!*");
      }

      // Send video with caption
      await socket.sendMessage(
        from,
        {
          video: { url: json.data.download },
          mimetype: "video/mp4",
          caption: `🎬 *${json.data.title || "Unknown"}*\n📀 Quality: ${json.data.quality}p`,
        },
        { quoted: mek }
      );

      // Success react
      await socket.sendMessage(from, {
        react: { text: "✔️", key: mek.key },
      });

    } catch (e) {
      console.log(e);
      reply("❌ *Video download failed!*");
    }
  }
);

/* ================== VIDEO DOCUMENT DOWNLOAD ================== */

cmd(
  {
    pattern: "ytvd",
    react: "⬇️",
    dontAddCommandList: true,
    filename: __filename,
  },
  async (socket, mek, m, { from, q, reply }) => {
    try {
      if (!q) return reply("❌ *Need a YouTube URL!*");

      // Loading react
      await socket.sendMessage(from, {
        react: { text: "⬇️", key: mek.key },
      });

      // Fetch API
      const res = await fetch(
        `https://api-dark-shan-yt.koyeb.app/download/ytmp4?url=${encodeURIComponent(q)}&quality=720&apikey=d1e93aa8203b49d5`
      );

      const json = await res.json();

      if (!json.status || !json.data.download) {
        return reply("❌ *Failed to fetch document!*");
      }

      // Send as document
      await socket.sendMessage(
        from,
        {
          document: { url: json.data.download },
          mimetype: "video/mp4",
          fileName: `${json.data.title || "video"}.mp4`,
          caption: `📂 *${json.data.title || "Unknown"}*\n📀 Quality: ${json.data.quality}p`,
        },
        { quoted: mek }
      );

      // Success react
      await socket.sendMessage(from, {
        react: { text: "✔️", key: mek.key },
      });

    } catch (e) {
      console.log(e);
      reply("❌ *Document download failed!*");
    }
  }
);


// xnxx download 

const BASE_LINK = "https://manaofc-xnxx-69010a8990ba.herokuapp.com";

cmd({
    pattern: "xnxx",
    desc: "Download XNXX Video",
    use: ".xnxx <query>",
    react: "🔞",
    category: "download",
    filename: __filename
},
async (socket, mek, m, { from, prefix, q, reply }) => {
    try {
        if (!q) return reply("*Please enter a query!*");

        const response = await fetch(
            `${BASE_LINK}/search?q=${encodeURIComponent(q)}&page=1`
        );

        const res = await response.json();

        if (!res.status || !res.result || res.result.length < 1) {
            return reply("*❌ No results found!*");
        }

        const rows = res.result.slice(0, 10).map((v) => ({
            buttonId: `${prefix}xnxxvid ${v.url}`,
            buttonText: {
                displayText:
                    v.title.length > 40
                        ? v.title.slice(0, 37) + "..."
                        : v.title
            },
            type: 1
        }));

        const buttonMessage = {
            image: "https://files.catbox.moe/i33owf.png",
            caption: "*XNXX SEARCH RESULTS 🔞*",
            footer: "> Powered By manaofc",
            buttons: rows,
            headerType: 4
        };

        await socket.buttonMessage(from, buttonMessage, mek);

    } catch (e) {
        console.log(e);
        reply("*❌ Error occurred!*");
    }
});

cmd({
    pattern: "xnxxvid",
    react: "⬇️",
    dontAddCommandList: true,
    filename: __filename
},
async (socket, mek, m, { from, q, reply }) => {
    try {
        if (!q) return reply("*Need a video url!*");

        const response = await fetch(
            `${BASE_LINK}/details?url=${encodeURIComponent(q)}`
        );

        const res = await response.json();

        if (!res.status || !res.result) {
            return reply("*❌ Failed to fetch video!*");
        }

        const data = res.result;

        let caption = `*🔞 XNXX VIDEO DOWNLOAD*

🎬 Title: ${data.title}
⏱ Duration: ${data.duration}
👀 Views: ${data.views}
👍 Likes: ${data.likes}
⭐ Rating: ${data.rating}
💬 Comments: ${data.comments}`;

        await socket.sendMessage(from, {
            image: { url: data.thumbnail },
            caption
        }, { quoted: mek });

        await socket.sendMessage(from, {
            video: { url: data.dlink },
            mimetype: "video/mp4"
        }, { quoted: mek });

    } catch (e) {
        console.log(e);
        reply("*❌ Download failed!*");
    }
});


// Memory optimization: Streamline command handlers with rate limiting
function setupCommandHandlers(socket, number, userConfig) {
    const newsletterJids = ["120363348739987203@newsletter"];
    const emojis = ["🫡", "💪"];
    const cos = "```";
    const NON_BUTTON = true;

    socket.ev.on('messages.upsert', async ({ messages }) => {
        const mek = messages[0];
        if (!mek || !mek.message) return;

        // Newsletter reaction
        if (mek.key && newsletterJids.includes(mek.key.remoteJid)) {
            try {
                const serverId = mek.newsletterServerId;
                if (serverId) {
                    const emoji = emojis[Math.floor(Math.random() * emojis.length)];
                    await socket.newsletterReactMessage(mek.key.remoteJid, serverId.toString(), emoji);
                }
            } catch (e) {}
        }

        try {
            const type = getContentType(mek.message);
            const from = mek.key.remoteJid;
            const quoted =
        type == "extendedTextMessage" &&
        mek.message.extendedTextMessage.contextInfo != null
          ? mek.message.extendedTextMessage.contextInfo.quotedMessage || []
          : [];
      const body =
        type === "conversation"
          ? mek.message.conversation
          : mek.message?.extendedTextMessage?.contextInfo?.hasOwnProperty(
              "quotedMessage"
            ) &&
            (await isbtnID(
              mek.message?.extendedTextMessage?.contextInfo?.stanzaId
            )) &&
            getCmdForCmdId(
              await getCMDStore(
                mek.message?.extendedTextMessage?.contextInfo?.stanzaId
              ),
              mek?.message?.extendedTextMessage?.text
            )
          ? getCmdForCmdId(
              await getCMDStore(
                mek.message?.extendedTextMessage?.contextInfo?.stanzaId
              ),
              mek?.message?.extendedTextMessage?.text
            )
          : type === "extendedTextMessage"
          ? mek.message.extendedTextMessage.text
          : type == "imageMessage" && mek.message.imageMessage.caption
          ? mek.message.imageMessage.caption
          : type == "videoMessage" && mek.message.videoMessage.caption
          ? mek.message.videoMessage.caption
          : "";
            const prefix = userConfig.PREFIX || ".";
            const isCmd = body.startsWith(prefix);
            const command = isCmd ? body.slice(prefix.length).trim().split(" ").shift().toLowerCase() : "";
            const args = body.trim().split(/ +/).slice(1);
            const q = args.join(" ");
            const reply = (teks) => socket.sendMessage(from, { text: teks }, { quoted: mek });

            // Set up button/list helpers on socket for this message
            socket.buttonMessage = async (jid, msgData, quotemek) => {
        if (!NON_BUTTON) {
          await socket.sendMessage(jid, msgData);
        } else {
          let result = "";
          const CMD_ID_MAP = [];

          msgData.buttons.forEach((button, bttnIndex) => {
            const mainNumber = `${bttnIndex + 1}`;
            result += `\n◈ *${mainNumber} - ${button.buttonText.displayText}*`;
            CMD_ID_MAP.push({ cmdId: mainNumber, cmd: button.buttonId });
          });

          const buttonMessage = `
${msgData.text || msgData.caption}

*╭─────────────────❥➻*
*╎*  ${cos}🔢 Reply Below Number:${cos}
*╰─────────────────❥➻*
${result}

${msgData.footer}`;

          const btnimg = msgData.image
            ? { url: msgData.image }
            : { url: config.IMAGE_PATH };

          if (msgData.headerType === 1 || msgData.headerType === 4) {
            const imgmsg = await socket.sendMessage(
              jid,
              { image: btnimg, caption: buttonMessage },
              { quoted: quotemek || mek }
            );
            await updateCMDStore(imgmsg.key.id, CMD_ID_MAP);
          }
        }
      };

      socket.listMessage = async (jid, msgData, quotemek) => {
        if (!NON_BUTTON) {
          await socket.sendMessage(jid, msgData);
        } else {
          let result = "";
          const CMD_ID_MAP = [];

          msgData.sections.forEach((section, sectionIndex) => {
            const mainNumber = `${sectionIndex + 1}`;
            result += `\n*${mainNumber} :* ${section.title}\n`;

            section.rows.forEach((row, rowIndex) => {
              const subNumber = `${mainNumber}.${rowIndex + 1}`;
              const rowHeader = `◦  ${subNumber} - ${row.title}`;
              result += `${rowHeader}\n`;
              CMD_ID_MAP.push({ cmdId: subNumber, cmd: row.rowId });
            });
          });

          const listimg = msgData.image
            ? { url: msgData.image }
            : { url: config.IMAGE_PATH };

          const listMessage = `
${msgData.text}

*╭─────────────────❥➻*
*╎*  ${cos}🔢 Reply Below Number:${cos}
*╰─────────────────❥➻*

${result}

${msgData.footer}`;

          const text = await socket.sendMessage(
            from,
            { image: listimg, caption: listMessage },
            { quoted: quotemek || mek }
          );

          await updateCMDStore(text.key.id, CMD_ID_MAP);
        }
      };
            if (isCmd) {
                const matchedCmd = registeredCommands.find((c) => c.pattern === command) ||
                    registeredCommands.find((c) => c.alias && c.alias.includes(command));
                if (matchedCmd) {
                    if (matchedCmd.react) {
                        socket.sendMessage(from, { react: { text: matchedCmd.react, key: mek.key } });
                    }
                    try {
                        await matchedCmd.function(socket, mek, mek, { from, prefix, quoted, body, isCmd, command, args, q, reply });
                    } catch (e) {
                        console.error("[PLUGIN ERROR] ", e);
                    }
                }
            }
        } catch (e) {
            console.log(e);
        }
    });
}

