const express = require('express')
const app = express()
const dotenv = require('dotenv')
dotenv.config()
const cors = require('cors')
const { MongoClient, ServerApiVersion } = require('mongodb');
const port = process.env.URI
const uri = process.env.DB_URI

app.use(cors())
app.use(express.json())
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();

    const db = client.db('crud-user')
    const crudCollection = db.collection('users')

    app.get('/users', async(req, res)=>{
      const result = await crudCollection.find().toArray()
      res.send(result)
    })

    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    //await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res)=>{
  res.send('server is running now')
})

app.listen(port, ()=>{
  console.log(`server is running on port http://localhost:${port}`);
})