const express = require('express')
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();
var cors = require('cors')

const app = express()
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.6soco.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true })

async function run() {

    try {
        await client.connect();
        console.log('database conn success');

        const database = client.db('todo_db');
        const todoCollection = database.collection('todo');

        // insert Todo
        app.post('/addTodo', async (req, res) => {
            const todo = req.body;
            const result = await todoCollection.insertOne(todo);
            res.send(result);
        })

        // read Todo
        app.get('/todo/:email', async (req, res) => {
            const email = req.params.email;
            const result = await todoCollection.find({ userEmail: email }).toArray();
            res.send(result)
        })

        //todo delete from all todos
        app.delete('/todo/delete/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await todoCollection.deleteOne(query);
            res.json(result);
        })




    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);


// ------------------home----------------
app.get('/', (req, res) => {
    res.send('Todo app running')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})