// PROBABLY NOT WORKING / HAVEN'T TESTED

const axios = require('axios');
require('dotenv').config();

// API key setup
const API_KEY = process.env.GIPHY_API_KEY;
const SLACK_BOT_TOKEN = process.env.SLACK_BOT_TOKEN;

async function getRandomGif(apiKey, tag = null, rating = null, randomId = null) {
    const url = "https://api.giphy.com/v1/gifs/random";
    const params = {
        api_key: apiKey,
        tag: tag,
        rating: rating,
        random_id: randomId
    };
    try {
        const response = await axios.get(url, { params });
        return response.data;
    } catch (error) {
        return {
            error: `Failed to fetch random gif, status code: ${error.response.status}`,
            response_text: error.response.statusText
        };
    }
}

async function sendMessageToSlack(token, channel, text) {
    const url = "https://slack.com/api/chat.postMessage";
    const headers = {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/x-www-form-urlencoded"
    };
    const data = new URLSearchParams({
        channel: channel,
        text: text
    });
    try {
        const response = await axios.post(url, data, { headers });
        if (response.data.ok) {
            console.log("Message sent to Slack successfully");
        } else {
            console.log(`Failed to send message to Slack, response: ${response.data.error}`);
        }
    } catch (error) {
        console.log(`Failed to send message to Slack, status code: ${error.response.status}, response: ${error.response.statusText}`);
    }
}

(async () => {
    const apiKey = API_KEY;
    const slackToken = SLACK_BOT_TOKEN;
    const slackChannel = "#teste";

    const randomResponse = await getRandomGif(apiKey, "tristeza");

    if (randomResponse.data && randomResponse.data.url) {
        const gifUrl = randomResponse.data.url;
        console.log(`GIF URL: ${gifUrl}`);
        await sendMessageToSlack(slackToken, slackChannel, gifUrl);
    } else {
        console.log("Failed to retrieve GIF URL");
    }
})();
