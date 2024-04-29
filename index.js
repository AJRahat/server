const express = require('express')
const cors = require('cors')
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send('Server is Connected');
})

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hqiw1xo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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

        const database = client.db("myExplore").collection("TourSpots");
        const countryDatabase = client.db("myExplore").collection("Countries");

        app.post('/spot', async (req, res) => {
            const container = req.body;
            // console.log(container);
            const result = await database.insertOne(container);
            res.send(result);
        })

        app.get('/spot', async (req, res) => {
            const cursor = database.find();
            const result = await cursor.toArray();

            res.send(result);
        })

        app.get('/spot/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await database.findOne(query);
            res.send(result);
        })

        app.put('/spot/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const option = { upsert: true };
            const user = req.body;
            const updatedUser = {
                $set: {
                    spotName: user.spotName,
                    countryName: user.countryName,
                    location: user.location,
                    description: user.description,
                    avgCost: user.avgCost,
                    season: user.season,
                    travelTime: user.travelTime,
                    totalVisitor: user.totalVisitor,
                    photo: user.photo,
                    email: user.email,
                    userName: user.userName,
                }
            };

            const result = await database.updateMany(filter, updatedUser, option);
            res.send(result);
        })

        app.delete('/spot/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await database.deleteOne(query);
            res.send(result);
        })

        app.get('/country', async (req, res) => {
            const cursor = countryDatabase.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        app.get('/country/:name', async (req, res) => {
            const id = req.params.name;
            const query = { countryName: (id) };
            const result = await countryDatabase.findOne(query);
            res.send(result);
        })




        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);

app.listen(port, () => {
    console.log(`Connected to Port : ${port}`);
})