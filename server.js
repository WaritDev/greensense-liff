const express = require("express");
const axios = require("axios");
const cors = require("cors");

require("dotenv").config();

const app = express();
app.use(cors());
const port = 8888;

const LINE_API_URL = "https://api.line.me/v2/bot/message/push";
const LINE_CHANNEL_ACCESS_TOKEN = process.env.LINE_CHANNEL_ACCESS_TOKEN
const BOTNOI_API_URL = "https://api-voice.botnoi.ai/openapi/v1/generate_audio";
const BOTNOI_API_KEY = process.env.BOTNOI_API_KEY;
const TYPHOON_AUDIO_API_URL = "https://audio.opentyphoon.ai/gradio_api/call/run_inference"
const TYPHOON_API_URL = "https://api.opentyphoon.ai/v1/chat/completions"
const TYPHOON_API_KEY = process.env.TYPHOON_API_KEY

app.use(express.json());

const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${LINE_CHANNEL_ACCESS_TOKEN}`,
};

const conversations = {}

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

const sendAudio = async (userId, audioUrl, duration) => {
  try {
    const body = {
      to: userId,
      messages: [
        {
          type: "audio",
          originalContentUrl: audioUrl, // Public URL of the audio file
          duration: duration, // Duration of the audio in milliseconds
        },
      ],
    };

    const response = await axios.post(
      "https://api.line.me/v2/bot/message/push",
      body,
      { headers }
    );

    console.log("Audio message sent successfully:", response.data);
    return response
  } catch (error) {
    console.error("Error sending audio message:", error.response?.data || error.message);
  }
}

const textToSpeech = async ( message ) => {
  try {
    const headers = {
      "Content-Type": "application/json",
      "Botnoi-Token": `${BOTNOI_API_KEY}`
    }
    const body = {
      text: message,
      speaker:"1",
      volume:1,
      speed:1,
      type_media:"m4a",
      save_file: "true",
      language: "th"
    }
    const response = await axios.post(`${BOTNOI_API_URL}`
      , body, { headers });
    const audioUrl = response.data.audio_url
    const duration = response.data.point
    // console.log(response)
    console.log(response.data)
    return { audioUrl, duration};
  } catch (error) {
    throw new Error(error)
  }
}

const speechToText = async (userId, audioUrl) => {
  try {
    const response = await axios.post(`${TYPHOON_AUDIO_API_URL}`
      , {
        "data": [
          {"path":"https://github.com/gradio-app/gradio/raw/main/test/test_files/audio_sample.wav"},
          "Hello!"
      ]}
    )
    // console.log(response)
  } catch (error) {
    throw new Error(error)
  }
}

const callTyphoon = async (userId , userMessage) => {
  try {
      if (!conversations[userId]) {
      conversations[userId] = { history: [] };
    }
    const userConversation = conversations[userId].history;

    // Push the system instruction only once at the beginning
    if (userConversation.length === 0) {
      userConversation.push({
        role: "system",
        content: "You are a helpful assistant. Answer only in Thai. Your replies should be concise and polite.",
      });
    }


    // Add the user's message to the conversation history
    userConversation.push({ role: "user", content: userMessage });

    // Prune the history to limit the number of messages sent to the API (e.g., last 10 exchanges)
    const prunedHistory = userConversation.slice(-20);

    const response = await axios.post(
      TYPHOON_API_URL,
      {
        model: "typhoon-v1.5x-70b-instruct",
        messages: prunedHistory,
        max_tokens: 512,
        temperature: 0.6,
        top_p: 0.95,
        repetition_penalty: 1.05,
        stream: false
      },
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${TYPHOON_API_KEY}`,
        },
      }
    );

    console.log(response)
    const typhoonReply = response.data.choices[0].message.content;
    userConversation.push({ role: "assistant", content: typhoonReply });

    // Save the updated history
    conversations[userId].history = userConversation;

    return typhoonReply;
  } catch (error) {
    console.error("Error calling Typhoon API:", error.response?.data || error.message);
    // Return a fallback response in case of an error
    return "ขออภัยค่ะ ฉันไม่สามารถตอบคำถามได้ในขณะนี้ กรุณาลองใหม่อีกครั้ง";
  }
}

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
    let response;

     // Initialize the conversation context if it doesn't exist
     if (!conversations[userId]) {
      conversations[userId] = {
        history: [],
        state: "idle", // Possible states: "idle", "text-mode", "speech-mode"
      };
    }

    const userMessage = lineEvent.message.text || ''; // Handle text input
    const userState = conversations[userId].state;


    if (userMessage === "start-text"){
      response = await sendMessage(userId, "เริ่มต้นโหมดข้อความ มีอะไรให้ช่วยไหมคะ?");
      conversations[userId] = { history: [], state: "text-mode" }; // Reset conversation
    } else if (userMessage === "start-speech") {
      response = await sendMessage(userId, "เริ่มต้นโหมดเสียง กรุณาพูดหรือพิมพ์คำถามของคุณค่ะ");
      conversations[userId] = { history: [], state: "speech-mode" }; // Reset conversation
    } else if (userMessage === "reset") {
      conversations[userId] = {
        history: [],
        state: "idle", // Possible states: "idle", "text-mode", "speech-mode"
      };
      response = await sendMessage(userId, "รีเซ็ตเรียบร้อยค่ะ")
    } else if (userState === "text-mode") {
      // Handle multi-turn text conversation
      const typhoonReply = await callTyphoon(userId, userMessage);
      response = await sendMessage(userId, typhoonReply);

      // Save the message and reply to conversation history
      conversations[userId].history.push({ role: "user", content: userMessage });
      conversations[userId].history.push({ role: "assistant", content: typhoonReply });
    } else if (userState === "speech-mode") { 
      // Handle speech-to-text
      let textMessage
      if (lineEvent.message.type === "audio") {
        const userAudioUrl = lineEvent.message.content; // Retrieve audio URL
        textMessage = await speechToText(userId, userAudioUrl);
      } else if (lineEvent.message.type === "text") {
        textMessage = userMessage
      } else {
        return;
      }

      const typhoonReply = await callTyphoon(userId, textMessage);
      // const {audioUrl, duration} = await textToSpeech("หวัดดีฮาฟฟู้ว")
      console.log(audioUrl, duration)
      // response = await sendAudio(userId, audioUrl, 30000)
      response = await sendMessage(userId, typhoonReply);

      // Save the audio-to-text message and reply to conversation history
      conversations[userId].history.push({ role: "user", content: textMessage });
      conversations[userId].history.push({ role: "assistant", content: typhoonReply });
    } else {
      response = await sendMessage(userId, "กรุณาพิมพ์ 'start-text' หรือ 'start-speech' เพื่อเริ่มต้นค่ะ");
    }

    res.json({
      message: "Send message successfully",
      responseData: response.data
    })
  } catch (error) {
    console.log("error");
    res.status(400).json({
      error: error.response,
    });
  }

    console.log('events', events)
})
app.listen(port, async () => {
  console.log(`Express app listening at http://localhost:${port}`);
});