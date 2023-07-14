require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
const port = process.env.PORT || 5000;

const { MongoClient } = require('mongodb');
const uri = process.env.MONGODB_URI;

const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    console.log("Connected to MongoDB!");
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    process.exit(1); // Exit the process with a non-zero code to indicate failure
  }
}

run().catch(console.dir);

app.get('/api/quotes', async (req, res) => {
  try {
    const db = client.db("quotesgen");
    const quotesCollection = db.collection("quotes");

    const count = await quotesCollection.countDocuments();
    const random = Math.floor(Math.random() * count);
    const quote = await quotesCollection.findOne({}, { skip: random });

    res.json(quote);
  } catch (error) {
    console.error('Error fetching quotes:', error);
    res.status(500).json({ error: error });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
