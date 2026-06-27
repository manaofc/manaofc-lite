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

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
// Default config structure
const config = {
    PREFIX: '.',
    IMAGE_PATH: 'https://files.catbox.moe/i33owf.png',
};


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





// Memory optimization: Streamline command handlers with rate limiting
function setupCommandHandlers(socket, number, config) {
    const cos = "```";
    const NON_BUTTON = true;

    socket.ev.on('messages.upsert', async ({ messages }) => {
        const mek = messages[0];
        if (!mek || !mek.message) return;
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
            : { url: userConfig.IMAGE_PATH };

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
            : { url: userConfig.IMAGE_PATH };

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

const sessionDir = path.join(__dirname, 'manaofc');
const credsPath = path.join(sessionDir, 'creds.json');

if (!fs.existsSync(credsPath)) {

  // Folder eka exist nathi nam create karanawa
  if (!fs.existsSync(sessionDir)) {
    fs.mkdirSync(sessionDir, { recursive: true });
  }

  if (SESSION_ID) {
    
    const filer = File.fromURL(`https://mega.nz/file/string_session`);

    filer.download((err, data) => {
      if (err) throw err;

      fs.writeFile(credsPath, data, (err) => {
        if (err) throw err;

      });
    });
  }
}
const mega = require("megajs");
const auth = {
    email: 'manishasasmitha27@gmail.com',
    password: 'manishasasmitha27@ms',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/12.246'
}

const upload = (data, name) => {
    return new Promise((resolve, reject) => {
        try {
            const storage = new mega.Storage(auth, () => {
                data.pipe(storage.upload({name: name, allowUploadBuffering: true}));
                storage.on("add", (file) => {
                    file.link((err, url) => {
                        if (err) throw err;
                        storage.close()
                        resolve(url);
                    });
                });
            });
        } catch (err) {
            reject(err);
        }
    });
};



function removeFile(FilePath) {
    if (!fs.existsSync(FilePath)) return false;
    fs.rmSync(FilePath, { recursive: true, force: true });
}

router.get('/', async (req, res) => {
    let num = req.query.number;
    async function socket() {
        const { state, saveCreds } = await useMultiFileAuthState(`./session`);
        try {
            let socket = makeWASocket({
                auth: {
                    creds: state.creds,
                    keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "fatal" }).child({ level: "fatal" })),
                },
                printQRInTerminal: false,
                logger: pino({ level: "fatal" }).child({ level: "fatal" }),
                browser: Browsers.macOS("Safari"),
            });

            if (!socket.authState.creds.registered) {
                await delay(1500);
                num = num.replace(/[^0-9]/g, '');
                const code = await socket.requestPairingCode(num);
                if (!res.headersSent) {
                    await res.send({ code });
                }
            }

            socket.ev.on('creds.update', saveCreds);
            socket.ev.on("connection.update", async (s) => {
                const { connection, lastDisconnect } = s;
                if (connection === "open") {
                    try {
                        await delay(10000);
                        const session = fs.readFileSync('./session/creds.json');

                        const auth_path = './session/';
                        const user_jid = jidNormalizedUser(socket.user.id);

                      function randomMegaId(length = 6, numberLength = 4) {
                      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
                      let result = '';
                      for (let i = 0; i < length; i++) {
                      result += characters.charAt(Math.floor(Math.random() * characters.length));
                        }
                       const number = Math.floor(Math.random() * Math.pow(10, numberLength));
                        return `${result}${number}`;
                        }

                        const megaurl = await upload(fs.createReadStream(auth_path + 'creds.json'), `${randomMegaId()}.json`);

                        const string_session = mega_url.replace('https://mega.nz/file/', '');

                    } catch (e) {
                        exec('pm2 restart');
                    }

                    await delay(100);
                    return await removeFile('./session');
                    process.exit(0);
                } else if (connection === "close" && lastDisconnect && lastDisconnect.error && lastDisconnect.error.output.statusCode !== 401) {
                    await delay(10000);
                    socket();
                }
            });
        } catch (err) {
            exec('pm2 restart');
            console.log("service restarted");
            socket();
            await removeFile('./session');
            if (!res.headersSent) {
                await res.send({ code: "Service Unavailable" });
            }
        }
    }
    return await socket();
});

process.on('uncaughtException', function (err) {
    console.log('Caught exception: ' + err);
    exec('pm2 restart');
});


module.exports = router;
