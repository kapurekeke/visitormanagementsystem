const express = require('express')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 3000;
const swaggerui = require('swagger-ui-express');
const swaggerjsdoc = require('swagger-jsdoc');

app.use(express.json())

// MongoDB connection URL
const uri = "mongodb+srv://b022120050:hazim12345@cluster0.gsshthc.mongodb.net/";

// Create a new MongoClient
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true }, {serverApi:
    {version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
}
});

// Connect to MongoDB
client.connect()
  .then(() => {
    console.log('Connected to MongoDB!');
  })
  .catch((error) => {
    console.error('Failed to connect to MongoDB:', error);
  });

// Define collection names
const db = client.db('vms');
const adminCollection = db.collection ('admin');
const visitorCollection = db.collection ('visitor');
const prisonerCollection = db.collection('prisoner');
const cellCollection = db.collection('cell');
const emergencyCollection = db.collection('emergencycontact');
const casedetailCollection = db.collection('casedetail');

app.get('/', (req, res) => {
   res.send('Hello World!')
})

const options = {
    definition: {
        openapi: '3.0.0',
        servers: [
            {
                url: 'http://localhost:3000',
            },
        ],
        info: {
            title: 'VMS API',
            version: '1.0.0',
            description: 'VMS API',
        },
    },
    apis: ['.index.js'],
};

const specs = swaggerjsdoc(options);
app.use('/api-docs', swaggerui.serve, swaggerui.setup(specs));

app.listen(port, () => {
   console.log(`Example app listening on port ${port}`)
})
