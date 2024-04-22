import "dotenv/config";
import cors from "cors";
import express from "express";
import { sendMail } from "./mailer.js";

process.on("unhandledRejection", (reason) => {
  console.log(reason);
});

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send({ message: "Hello World" });
});

const timeout = new Map();
const tenMinutes = 1000 * 60 * 10;
app.get("/send-mail", async (req, res) => {
  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

  if (timeout.has(ip)) {
    const t = timeout.get(ip);
    const diff = Date.now() - t;
    const minutes = Math.floor((tenMinutes - diff) / 60000);
    const seconds = Math.floor((tenMinutes - diff) / 1000) % 60;

    return res.status(400).send({
      message: `You can only send an email every 10 minutes. Please wait ${minutes} minutes and ${seconds} seconds.`,
    });
  }

  timeout.set(ip, Date.now());
  setTimeout(() => {
    timeout.delete(ip);
  }, Math.random() * tenMinutes);

  await sendMail(JSON.stringify(req.headers, null, 2));

  res.send({ message: "Success!" });
});

app.listen(3000, () => {
  console.log(`http://localhost:3000`);
});
