const express = require("express");
const axios = require("axios");
const cors = require("cors");

require("dotenv").config();

const app = express();
app.use(cors());
const port = 8888;

const LINE_API_URL = "https://api.line.me/v2/bot/message/push";
const LINE_CHANNEL_ACCESS_TOKEN = process.env.LINE_CHANNEL_ACCESS_TOKEN

app.use(express.json());

const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${LINE_CHANNEL_ACCESS_TOKEN}`,
};

const sendMessage = async (userId, message) => {
  const body = {
    to: userId,
    messages: [
      {
        type: "text",
        text: message,
      },
    ],
  };
  const response = await axios.post(LINE_API_URL, body, { headers });
  return response;
};



app.post("/send-message", async (req, res) => {
  const { userId, message } = req.body;

  try {
    const response = await sendMessage(userId, message);
    console.log("=== LINE log", response.data);
    res.json({
      message: "Message OK",
    });
  } catch (error) {
    console.log("error", error.response.data);
    res.status(400).json({
      error: error.response,
    });
  }
});

app.post('/webhook', async (req, res) => {
    const {events} = req.body

    if (!events || events.length === 0) {
        res.json({
            message: 'OK'
        })
        return false
    }

  try {
    const lineEvent = events[0]
    const userId = lineEvent.source.userId
    const response = await sendMessage(userId, 'Hello From Webhook');
    console.log("=== LINE log", response.data);
    res.json({
      message: "Message OK",
    });
  } catch (error) {
    console.log("error", error.response.data);
    res.status(400).json({
      error: error.response,
    });
  }

    console.log('events', events)
})
app.listen(port, async () => {
  console.log(`Express app listening at http://localhost:${port}`);
});