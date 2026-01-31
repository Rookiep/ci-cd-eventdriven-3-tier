const express = require("express");
const amqp = require("amqplib");

const app = express();
app.use(express.json());

const QUEUE = "tasks";
const RABBITMQ_URL = "amqp://guest:guest@rabbitmq:5672";

let channel;

async function connectRabbit() {
  const connection = await amqp.connect(RABBITMQ_URL);
  channel = await connection.createChannel();
  await channel.assertQueue(QUEUE);
  console.log("Connected to RabbitMQ");
}

async function startServer() {
  await connectRabbit();  // wait for RabbitMQ connection
  app.listen(3000, () => console.log("API running on 3000"));
}

startServer();
