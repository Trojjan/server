require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
const port = process.env.PORT || 5000;

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = process.env.MONGODB_URI;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


// GET a random quote
app.get('/api/quotes', async (req, res) => {
    try {
      const db = client.db("quotesgen"); 
      const quotesCollection = db.collection("quotes"); 
  
      const count = await quotesCollection.countDocuments();
      const random = Math.floor(Math.random() * count);
      const quote = await quotesCollection.findOne({}, { skip: random });
  
      res.json(quote);
    } catch (error) {
      console.error('Error fetching quotes:',  error);
      res.status(500).json({ error: error });
    }
  });
  
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
