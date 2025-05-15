// server.js
import express from "express";
import { AccessToken } from "livekit-server-sdk";
import { config } from "dotenv";
import cors from "cors";
// const cors = require("cors");
config();
const createToken = async ({ participantName, isCreator, roomName }) => {
  // If this room doesn't exist, it'll be automatically created when the first
  // participant joins
  // const roomName = "quickstart-room";
  // Identifier to be used for participant.
  // It's available as LocalParticipant.identity with livekit-client SDK
  //   const participantName = "quickstart-username";

  const at = new AccessToken(
    process.env.LIVEKIT_API_KEY,
    process.env.LIVEKIT_API_SECRET,
    {
      identity: participantName,
      // Token to expire after 60 minutes
      ttl: "60m",
    }
  );
  at.addGrant({
    roomJoin: true,
    room: roomName,
    canPublish: isCreator ? true : false,
    canPublishData: true,
    // hidden: !isCreator ? true : false,
  });
  return await at.toJwt();
};

const app = express();
const port = 3001;
app.use(cors());
app.use(express.json());

app.post("/getToken", async (req, res) => {
  const { participantName, isCreator, roomName } = req.body;
  console.log("participantName : ", participantName);
  console.log("isCreator : ", isCreator);
  console.log("roomName : ", roomName);
  const token = await createToken(req.body);
  res.json({ token });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
