const express = require("express")
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const cors = require('cors')
const port = 4000;
const dotenv = require("dotenv").config();

// middlewares
app.use(cors())
app.use(express.json())


const uri = `${process.env.URI}`;


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

        await client.connect();

        const demoCollection = client.db('db name').collection("collectio name")
        

        // user apis
        app.get('/users', async (req, res) => {
            let query = {}
            if (req.query?.email) {
                query = { userEmail: req.query.email }
                const result = await userCollection.findOne(query)
                return res.send(result)
            } else {
                const result = await userCollection.find(query).toArray()
                return res.send(result)
            }

        })



        app.post('/users/create-user', async (req, res) => {
            const newUser = req.body;
            const result = await userCollection.insertOne(newUser);
            return result
        })

        app.delete('/user', async (req, res) => {
            let query = {}
            if (req.query?.email) {
                query = { userEmail: req.query.email }
            } else {
                return res.status(200).send({ message: "User not found !" })
            }

            console.log(query, 'query')
            const result = await userCollection.findOneAndDelete(query)
            // res.send(result)
        })



        //** income apis** */ 
        
        app.post('/income/create-income', async (req, res) => {
            const { userData, incomeData } = req.body;
            const filter = { userEmail: userData.userEmail }
            const result = await userCollection.findOne(filter)
            if (result.userName) {
                const newIncome = { userEmail: userData.userEmail, userId: userData._id, incomeData: incomeData }
                const result = await incomeCollection.insertOne(newIncome)
                console.log(result)
                return res.send(result)
            } else {
                return res.status(200).send({ message: "User not found !" })
            }

        })

        app.get('/income', async (req, res) => {
            let query = {}
            if (req.query?.email) {
                query = { userEmail: req.query.email }
                const result = await incomeCollection.find(query).toArray()
                return res.send(result)
            } else {
                const result = await incomeCollection.find(query).toArray()
                return res.send(result)
            }

        })
        app.put('/income/:id', async (req, res) => {
            const id = req.params.id;
            const incomeData = req.body;
            const filter = { _id: new ObjectId(id) }
            const options = { upsert: true };
            const updatedDoc = {
                $set: { incomeData }
            }
            const result = await incomeCollection.updateOne(filter, updatedDoc, options)
            res.send(result)
        })

        app.delete('/income/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await incomeCollection.findOneAndDelete(query)
            res.send(result)
        })

         // cost apis
         app.post('/cost/create-cost', async (req, res) => {
            const { userData, costData } = req.body;
            const filter = { userEmail: userData.userEmail }
            const result = await userCollection.findOne(filter)
            if (result.userName) {
                const newCost = { userEmail: userData.userEmail, userId: userData._id, costData: costData }
                const result = await costCollection.insertOne(newCost)
                return res.send(result)
            } else {
                return res.status(200).send({ message: "User not found !" })
            }

        })

        app.get('/cost', async (req, res) => {
            let query = {}
            if (req.query?.email) {
                query = { userEmail: req.query.email }
                const result = await costCollection.find(query).sort({ _id: -1 }).toArray()
                return res.send(result)
            } else {
                const result = await costCollection.find(query).sort({ _id: -1 }).toArray()
                return res.send(result)
            }
        })

        app.put('/cost/:id', async (req, res) => {
            const id = req.params.id;
            const costData = req.body;
            console.log(costData)
            const filter = { _id: new ObjectId(id) }
            const options = { upsert: true };
            const updatedDoc = {
                $set: { costData }
            }
            const result = await costCollection.updateOne(filter, updatedDoc, options)
            res.send(result)
        })

        app.delete('/cost/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await costCollection.findOneAndDelete(query)
            res.send(result)
        })


    } finally {

    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Template Server is Running')
})




app.listen(`${port}`, () => {
    console.log(`server is running on the ${port} port`)
})

