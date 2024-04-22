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

app.get("/send-mail", async (req, res) => {
  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

  if (timeout.get(ip)) {
    return res.status(400).send({ message: "Timeout" });
  }

  timeout.set(ip, true);
  setTimeout(() => {
    timeout.delete(ip);
  }, Math.random() * 1000 * 60 * 10);

  await sendMail(JSON.stringify(req.headers, null, 2));

  res.send({ message: "Success!" });
});

app.listen(3000, () => {
  console.log(`http://localhost:3000`);
});
