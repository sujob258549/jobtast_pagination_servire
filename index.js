const express = require('express')
const cors = require("cors")
const app = express()
const port = process.env.PORT || 3000

app.use(cors())
app.use(express.json())


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://jobtask_b9:sCHDfLZsOubWoqTB@atlascluster.aasa6jh.mongodb.net/?retryWrites=true&w=majority&appName=AtlasCluster";

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

    const sciccalection = client.db('unmokTask').collection('products');

    app.get('/productes', async (req, res) => {
      const page = parseInt(req.query.page);
      const size = parseInt(req.query.size);
      const categorys = req?.query?.categorys;
      const serch = req?.query?.serch;
      console.log(serch)

      let query = {};
      if (categorys) {
          query = { "category": categorys }
      }

      if (serch) query = {
        productName: { $regex: serch, $options: 'i' }
      };

      const cursor = await sciccalection.find(query)
      .skip(size * page)
      .limit(size)
      .toArray();
      res.send(cursor)
    })




   

    app.get('/productCount', async (req, res) => {

      const count = await sciccalection.estimatedDocumentCount();
      res.send({ count })
    })


    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    // console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('job task b9')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})