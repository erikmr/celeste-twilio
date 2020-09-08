const express = require("express");
const request = require("request");
const app = express();
const dialogflowSessionClient = require("./botlib/dialogflow_session_client.js");
const bodyParser = require("body-parser");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const projectId = "Su Seguro";
const phoneNumber = "525568269690";
const accountSid = process.env["ACCOUNT_SID"];
const authToken = process.env["API_TOKEN"];
console.log(accountSid);
const client = require("twilio")(accountSid, authToken);
const MessagingResponse = require("twilio").twiml.MessagingResponse;
const sessionClient = new dialogflowSessionClient(projectId);

const listener = app.listen(process.env.PORT, function () {
  console.log(
    "Your Twilio integration server is listening on port " +
      listener.address().port
  );
});

app.post("/", async function (req, res) {
  const body = req.body;
  console.log(authToken);
  console.log(body);
  const text = body.Body;
  const id = body.From;
  const dialogflowResponse = (await sessionClient.detectIntent(text, id, body))
    .fulfillmentText;
  const twiml = new MessagingResponse();
  const message = twiml.message(dialogflowResponse);
  res.send(twiml.toString());
});

process.on("SIGTERM", () => {
  listener.close(() => {
    console.log("Closing http server.");
    process.exit(0);
  });
});
