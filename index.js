const express = require('express')
const app = express()
const dotenv = require('dotenv')
dotenv.config()
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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

    app.get('/users/:id', async(req, res)=>{
      const id = req.params.id
      const query = {
        _id: new ObjectId(id)
      }
      const result = await crudCollection.findOne(query)
      res.send(result)
    })

    app.delete('/users/:id', async(req, res)=>{
      const id = req.params.id
      const query = {
        _id: new ObjectId(id)
      }
      const result = await crudCollection.deleteOne(query)
      res.send(result)
    })

    app.post('/users', async(req, res)=>{
      const newUser = req.body
      const result  = await crudCollection.insertOne(newUser)
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