// setup.js
import { DynamoDBClient, CreateTableCommand } from "@aws-sdk/client-dynamodb";

const client = new DynamoDBClient({
  region: "us-east-1",
  endpoint: "http://localhost:8000",
  credentials: {
    accessKeyId: "dummy",
    secretAccessKey: "dummy",
  },
});

await client.send(new CreateTableCommand({
  TableName: "Users",
  KeySchema: [
    { AttributeName: "id", KeyType: "HASH" }, // partition key
  ],
  AttributeDefinitions: [
    { AttributeName: "id", AttributeType: "S" }, // S = string
  ],
  BillingMode: "PAY_PER_REQUEST",
}));

console.log("Table created!");
