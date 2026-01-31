const amqp = require("amqplib");

const QUEUE = "tasks";
const RABBITMQ_URL = "amqp://guest:guest@rabbitmq:5672";

async function consume() {
  const connection = await amqp.connect(RABBITMQ_URL);
  const channel = await connection.createChannel();
  await channel.assertQueue(QUEUE);

  console.log("Worker waiting for messages...");

  channel.consume(QUEUE, msg => {
    console.log("Processing:", msg.content.toString());
    channel.ack(msg);
  });
}

consume();
