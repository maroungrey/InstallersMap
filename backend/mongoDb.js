const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI || "mongodb+srv://admin:<db_password>@users.gewti.mongodb.net/?retryWrites=true&w=majority&appName=Users";

const client = new MongoClient(uri);

async function connectToMongo() {
  try {
    await client.connect();
    console.log("Connected successfully to MongoDB");
    return client.db('batteryComparison'); // You can change 'batteryComparison' to your preferred database name
  } catch (error) {
    console.error("Could not connect to MongoDB", error);
    process.exit(1);
  }
}

module.exports = { connectToMongo, client };