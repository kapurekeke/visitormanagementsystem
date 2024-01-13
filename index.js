const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const swaggerui = require('swagger-ui-express');
const jwt = require('jsonwebtoken');
const swaggerjsdoc = require('swagger-jsdoc');

const app = express();
const port = process.env.PORT || 3000;

// MongoDB connection URL
const uri = "mongodb+srv://hajimu69:hAZimFAhm1kaYKaY24@cluster1.gljgb6e.mongodb.net/";

// Create a new MongoClient
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true }, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
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
const adminCollection = db.collection('admin');
const visitorCollection = db.collection('visitor');
const prisonerCollection = db.collection('prisoner');

// Middleware to parse JSON
app.use(express.json());

// Authentication middleware
function verifyToken(req, res, next) {
  let header = req.headers.authorization;

  // Check if the Authorization header is present
  if (!header) {
    return res.status(401).send('Authorization header is missing');
  }

  // Split the header to extract the token
  let tokenParts = header.split(' ');

  // Check if the expected token format is present
  if (tokenParts.length !== 2 || tokenParts[0].toLowerCase() !== 'bearer') {
    return res.status(401).send('Invalid Authorization header format');
  }

  let token = tokenParts[1];

  jwt.verify(token, 'inipassword', function (err, decoded) {
    if (err) {
      return res.status(401).send('Invalid Token');
    }

    req.user = decoded;
    next();
  });
}

// Function to generate JWT token
function generateToken(userData) {
  const token = jwt.sign(userData, 'inipassword');
  return token;
}

// Function to handle admin login
async function login(reqUsername, reqPassword) {
  try {
    const matchUsers = await adminCollection.findOne({ username: reqUsername, password: reqPassword });

    if (!matchUsers) {
      return {
        success: false,
        message: "Admin not found!",
      };
    } else {
      return {
        success: true,
        users: matchUsers,
      };
    }
  } catch (error) {
    console.error('Error in login:', error);
    return {
      success: false,
      message: "An error occurred during login.",
    };
  }
}

// Function to check visitor pass
async function visitorspass(reqicnum) {
  try {
    const matchedUser = await visitorCollection.findOne({ icnumber: reqicnum });

    if (matchedUser) {
      return {
        success: true,
        message: matchedUser,
      };
    } else {
      return {
        success: false,
        user: "Visitor pass not found!",
      };
    }
  } catch (error) {
    console.error('Error in finding visitor pass:', error);
    return {
      success: false,
      message: "An error occurred.",
    };
  }
}

// Function to register admin
async function register(reqUsername, reqPassword) {
  try {
    await adminCollection.insertOne({
      username: reqUsername,
      password: reqPassword,
    });

    return "Registration successful!";
  } catch (error) {
    console.error('Registration failed:', error);
    return "Error encountered!";
  }
}

// API Routes

// Login Admin
app.post('/login', (req, res) => {
  let result = login(req.body.username, req.body.password);
  result.then(response => {
    if (response.success) {
      let token = generateToken(response.users);
      res.send("Auth Token: " + token);
    } else {
      res.status(401).send(response.message);
    }
  }).catch(error => {
    console.error('Error in login route:', error);
    res.status(500).send("An error occurred during login.");
  });
});

// Register Admin
app.post('/register', verifyToken, (req, res) => {
  let result = register(req.body.username, req.body.password);
  result.then(response => {
    res.send(response);
  }).catch(error => {
    console.error('Error in register route:', error);
    res.status(500).send("An error occurred during registration.");
  });
});

//visitors pass
app.post('/visitorspass/:icnum', async (req, res) => {
  const { icnum } = req.params;

  try {
    const result = await visitorspass(icnum);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});


// Add a visitor
app.post('/addvisitor', verifyToken, (req, res) => {
  const { name, icnumber, relationship, prisonerId, date, time } = req.body;
  const visitorData = { name, icnumber, relationship, prisonerId, date, time };

  visitorCollection.insertOne(visitorData)
    .then(() => {
      res.send(visitorData);
    })
    .catch((error) => {
      console.error('Error adding visitor:', error);
      res.status(500).send('An error occurred while adding the visitor');
    });
});

// Add a prisoner
app.post('/addprisoner', verifyToken, (req, res) => {
  const { name, icnumber, prisonerId } = req.body;
  const prisonerData = { name, icnumber, prisonerId };

  prisonerCollection.insertOne(prisonerData)
    .then(() => {
      res.send(prisonerData);
    })
    .catch((error) => {
      console.error('Error creating prisoner:', error);
      res.status(500).send('An error occurred while creating the prisoner');
    });
});

// View all visitors
app.get('/visitors', verifyToken, async (req, res) => {
  try {
    const prisoner = await db.collection('visitor').find().toArray();
    res.send(prisoner);
  } catch (error) {
    res.status(500).send('Error viewing visitors');
  }
});

// View all prisoner
app.get('/prisoner', verifyToken, async (req, res) => {
  try {
    const prisoner = await db.collection('prisoner').find().toArray();
    res.send(prisoner);
  } catch (error) {
    res.status(500).send('Error viewing prisoner');
  }
});

// Swagger Documentation
const options = {
  definition: {
    openapi: '3.0.0',
    servers: [
      {
        url: 'https://vmsprison.azurewebsites.net',
      },
    ],
    info: {
      title: 'VMS PRISON API',
      version: '1.0.0',
    },
  },
  apis: ['./main.js'],
};

const specs = swaggerjsdoc(options);
app.use('/api-docs', swaggerui.serve, swaggerui.setup(specs));

// Start the server
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
