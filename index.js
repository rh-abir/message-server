const { MongoClient, ServerApiVersion } = require("mongodb");
const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");

const PORT = process.env.PORT || 5000;

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
    const messageCollection = client.db("messageDB").collection("message");
    // const messageUpl

    // put new user in db
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

    // get friend without crunt user
    app.get("/get-friends/:email", async (req, res) => {
      const email = req.params.email;

      try {
        const friendGet = await usersCollection.find({
          email: {$ne: email}
        }).toArray();
        // const filter = data.filter((d) => d.email !== email);
        res.status(200).send(friendGet);
      } catch (erro) {
        console.log(erro);
      }
    });


    // storage message in db
    app.post("/send-message", async (req, res) => {
      try {
        
        const data = req.body;
        const result = await messageCollection.insertOne({ messageData: data });
        res.send({ result, messageData: {messageData: data} });

      } catch (error) {
        res.status(500).json({error: {errorMessage: 'Internal server error'}})
      }
    });



    // get all message between two friend 
    app.get('/get-message/:fdEmail/:myEmail', async(req, res) => {
      const fdEmail = req.params.fdEmail  
      const myEmail = req.params.myEmail

      try{


        let getAllMessage = await messageCollection.find({
          $or:[
            
            {
              $and:[{'messageData.senderEmail': {$eq: myEmail}}, {'messageData.reseverEmail': {$eq: fdEmail}}]
            },
            {
              $and:[{'messageData.senderEmail': {$eq: fdEmail}}, {'messageData.reseverEmail': {$eq: myEmail}}]
            }

          ]
        }).toArray()
        
        // let getAllMessage = await messageCollection.find().toArray()
        
        // getAllMessage = getAllMessage?.filter(m=> m.messageData.senderEmail === myEmail &&  m.messageData.reseverEmail === fdEmail || m.messageData.reseverEmail === myEmail && m.messageData.senderEmail === fdEmail)
         
        res.send(getAllMessage)

      }
      catch(error) {
        res.status(500).json({error: {errorMessage: 'Internal server error'}})
      }

      // console.log(fdEmail, myEmail)
    })


    app.post('/image-message-send', async(req, res) => {
      try {
        
        const data = req.body;
        const result = await messageCollection.insertOne({ messageData: data });
        res.send({ result, messageData: {messageData: data} });

      } catch (error) {
        res.status(500).json({error: {errorMessage: 'Internal server error'}})
      }
    })





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
