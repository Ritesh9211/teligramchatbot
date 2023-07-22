// const TelegramBot = require('node-telegram-bot-api');
// const token = '5974021571:AAGAr8sgSUHwAEOJBXKorkO6b5xF2Xbi1PY';
// const bot = new TelegramBot(token, {polling: true});
// bot.on('message', (msg) => {

//     var Hi = "hi";
//     if (msg.text.toString().toLowerCase().indexOf(Hi) === 0) {
//     bot.sendMessage(msg.chat.id,"Hello bro this is msg from Ritesh's bot");
//     }
    
//     });



const axios = require('axios');
const { appendFile } = require('fs');
const dotenv = require("dotenv");
dotenv.config();
const TelegramBot = require('node-telegram-bot-api');

//we can keep this in .env file to protect it

// const TELEGRAM_BOT_TOKEN = '5974021571:AAGAr8sgSUHwAEOJBXKorkO6b5xF2Xbi1PY';
const TELEGRAM_BOT_TOKEN = process.env.bot_tokken;
const TELEGRAM_GROUP_ID = process.env.teligram_groupid;

const bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { polling: true });


// Function to fetch a random Wikipedia article
async function getRandomWikiArticle() {
  const response = await axios.get('https://en.wikipedia.org/w/api.php', {
    params: {
      action: 'query',
      list: 'random',
      rnnamespace: 0,
      format: 'json',
    },
  });
//   console.log(response.data.query.random[0]);
//   console.log(response.data.query.random[0].title);
  const randomArticle = response.data.query.random[0];
  return randomArticle.title; //this will return first random article's title
}

// getRandomWikiArticle();  //testing of getRandom function

// Function to get the summary of a Wikipedia article

async function getWikiArticleSummary(articleTitle) {
  const response = await axios.get('https://en.wikipedia.org/w/api.php', {
    params: {
      action: 'query',
      prop: 'extracts',
      exintro: true,
      titles: articleTitle,
      format: 'json',
    },
  });
//   console.log(response.data.query.pages);
  const articlePage = Object.values(response.data.query.pages)[0];
  return articlePage.extract;
}
//testing of getwikiarticlesummary
// getWikiArticleSummary("Martyn Burke");

// Function to post the article and its summary to the Telegram group
async function postRandomWikiArticle() {
  try {
    // Get a random Wikipedia article
    let randomArticleTitle = await getRandomWikiArticle();
    let articleSummary = await getWikiArticleSummary(randomArticleTitle);
    // Post to Telegram group
    randomArticleTitle = randomArticleTitle.replace( /(<([^>]+)>)/ig, ''); //this will remove the tags from the response data
    articleSummary = articleSummary.replace( /(<([^>]+)>)/ig, '');
    console.log("randomArticleTitle",randomArticleTitle);
    console.log("articleSummary",articleSummary)
    // console.log(articleSummary);

    // bot.sendMessage(TELEGRAM_GROUP_ID,"Hello bro this is msg from Ritesh's bot");
    

    bot.sendMessage(TELEGRAM_GROUP_ID, `*"Title"${randomArticleTitle}*\n"Content"${articleSummary}`, {
      parse_mode: 'Markdown',
    });
    
  } catch (error) {
    console.error('Error posting to Telegram:', error.message);
  }
}
// postRandomWikiArticle(); //testing above function
bot.on('message', (msg) => {
    console.log(msg);
    var Hi = "hi";
    bot.sendChatAction(msg.chat.id, 'typing');
    if (msg.text.toString().toLowerCase().indexOf(Hi) === 0) {
    bot.sendMessage(msg.chat.id,"Hello bro this is msg from Ritesh's bot");
    }
    
    });
// Command handler to trigger posting the random Wikipedia article
//on writing /postwikidata this below function will be triggered and will send data in response which is consoled
//one on /postwikidata data will be messaged by bot
bot.onText(/\/postwikidata/, (msg) => {
  const chatId = msg.chat.id;
    console.log("msg",chatId)
  bot.sendChatAction(chatId, 'typing');
  postRandomWikiArticle();
});

//This was random generation of wiki data by teligram bot to a group