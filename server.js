const express = require("express");
const { DynamoDBClient, PutItemCommand, GetItemCommand, UpdateItemCommand } = require("@aws-sdk/client-dynamodb");

const app = express();
app.use(express.json());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

const client = new DynamoDBClient({
  region: "us-east-1",
  endpoint: "http://localhost:8000",
  credentials: { accessKeyId: "dummy", secretAccessKey: "dummy" },
});

app.post("/users", async (req, res) => {
  const { id, wins = 0 } = req.body;
  await client.send(new PutItemCommand({
    TableName: "Users",
    Item: { id: { S: id }, wins: { N: String(wins) } },
  }));
  res.json({ message: "User created" });
});

app.get("/users/:id", async (req, res) => {
  const result = await client.send(new GetItemCommand({
    TableName: "Users",
    Key: { id: { S: req.params.id } },
  }));
  if (!result.Item) return res.status(404).json({ error: "User not found" });
  res.json(result.Item);
});

app.patch("/users/:id", async (req, res) => {
  await client.send(new UpdateItemCommand({
    TableName: "Users",
    Key: { id: { S: req.params.id } },
    UpdateExpression: "SET wins = wins + :inc",
    ExpressionAttributeValues: { ":inc": { N: "1" } },
  }));
  res.json({ message: "Win recorded" });
});

app.listen(3001, () => console.log("Server running on port 3001"));