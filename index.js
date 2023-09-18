const { MongoClient, ServerApiVersion } = require("mongodb");
const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");

const PORT = process.env.PORT || 4000;

//meddileware
app.use(cors());
app.use(express.json());

const uri =
  "mongodb+srv://rhabir71:Gqp4RCfkj7JAmt5J@cluster0.w4fbivq.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    
    const usersCollection = client.db("messageDB").collection("users");

    app.put("/users/:email", async (req, res) => {
      const email = req.params.email;
      const user = req.body;
      // console.log(email, user);
      const option = { upsert: true };
      const query = { email: email };
      const updateDoc = {
        $set: user,
      };

      const result = await usersCollection.updateOne(query, updateDoc, option);
      // console.log(result);
      res.send(result);
    });

    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.json("message is ok ");
});

app.listen(PORT, () => {
  console.log(`message server is runnig ${PORT}`);
});
