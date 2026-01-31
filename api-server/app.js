const express = require("express");
const amqp = require("amqplib");

const app = express();
app.use(express.json());

// Queue and RabbitMQ connection
const QUEUE = "tasks";
const RABBITMQ_URL = "amqp://guest:guest@rabbitmq:5672"; // Use localhost if not in Docker

let channel;

// Function to connect to RabbitMQ
async function connectRabbit() {
  try {
    const connection = await amqp.connect(RABBITMQ_URL);
    channel = await connection.createChannel();
    await channel.assertQueue(QUEUE, { durable: true }); // Durable queue survives RabbitMQ restarts
    console.log("✅ Connected to RabbitMQ, queue ready:", QUEUE);

    // Optional: handle connection close or errors
    connection.on("close", () => {
      console.error("❌ RabbitMQ connection closed");
      process.exit(1);
    });
    connection.on("error", (err) => {
      console.error("❌ RabbitMQ connection error:", err);
      process.exit(1);
    });

  } catch (err) {
    console.error("❌ Failed to connect to RabbitMQ:", err);
    process.exit(1); // Stop server if RabbitMQ is not reachable
  }
}

// Start server only after RabbitMQ is connected
async function startServer() {
  await connectRabbit();

  app.post("/task", async (req, res) => {
    try {
      const { task } = req.body;
      if (!task) return res.status(400).send({ error: "Task is required" });

      channel.sendToQueue(QUEUE, Buffer.from(task), { persistent: true }); // Persistent messages
      console.log("➡️ Task queued:", task);
      res.send({ status: "queued", task });
    } catch (err) {
      console.error("❌ Failed to queue task:", err);
      res.status(500).send({ error: "Failed to queue task" });
    }
  });

  app.listen(3000, () => console.log("🚀 API running on http://localhost:3000"));
}

// Start everything
startServer();