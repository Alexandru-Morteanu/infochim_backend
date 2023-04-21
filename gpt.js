const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
app.use(
  cors({
    origin: "http://localhost:3000",
  }),
  express.json()
);
const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: process.env.OPEN_AI_KEY,
});
const openai = new OpenAIApi(configuration);
app.post("/verify", async (req, res) => {
  const { buretSol, indicator, erlenSol } = req.body;
  console.log(indicator);
  try {
    const response1 = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `tell me just yes or no if ${buretSol} is a strong base`,
      max_tokens: 10,
    });
    const response2 = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `tell me just yes or no if ${indicator} is an indicator`,
      max_tokens: 10,
    });
    const response3 = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `tell me just yes or no if ${erlenSol} is a strong acid`,
      max_tokens: 10,
    });
    const verification1 = response1.data.choices[0].text;
    const verification2 = response2.data.choices[0].text;
    const verification3 = response3.data.choices[0].text;
    const colors = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: `when titrating between strong acid and strong base, tell me the colors that ${indicator} has. TELL ME THE COLORS IN 2 WORDS FIRST THE COLOR IN ACID. then write me these colors in rgb no hex, if colorless rgb(255,255,255)`,
        },
      ],
      max_tokens: 100,
    });
    console.log(colors.data.choices[0].message.content);
    res.status(200).json({
      buret: verification1,
      indicator: verification2,
      erlen: verification3,
      colors: colors.data.choices[0].message.content,
    });
  } catch (error) {
    res.status(400);
  }
});

app.use(express.json());

const port = process.env.PORT || 5050;

app.listen(port, () => {
  console.log("Nice");
});
