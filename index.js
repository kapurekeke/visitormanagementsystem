const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const swaggerui = require('swagger-ui-express');
const jwt = require('jsonwebtoken');
const swaggerjsdoc = require('swagger-jsdoc');

const app = express();
const port = process.env.PORT || 3000;

// MongoDB connection URL
const uri = "mongodb+srv://hajimu69:hAZimFAhm1kaYKaY24@cluster1.gljgb6e.mongodb.net/";
//const uri = "mongodb+srv://b022120050:hazim123456789@cluster0.jfboppa.mongodb.net/";

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

// Admin Authentication middleware
function verifyAdminToken(req, res, next) {
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

  jwt.verify(token, 'adminpassword', function (err, decoded) {
    if (err) {
      return res.status(401).send('Invalid Token');
    }

    req.user = decoded;
    next();
  });
}

// Visitor Authentication middleware
function verifyVisitorToken(req, res, next) {
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

  jwt.verify(token, 'visitorpassword', function (err, decoded) {
    if (err) {
      return res.status(401).send('Invalid Token');
    }

    req.user = decoded;
    next();
  });
}

// Function to generate admin JWT token
function generateAdminToken(userData) {
  const token = jwt.sign(userData, 'adminpassword');
  return token;
}

// Function to generate visitor token
function generateVisitorToken(visitorData) {
  const token = jwt.sign(visitorData, 'visitorpassword');
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

// Function to register visitor
async function registerVisitor(reqFirstName, reqLastName, reqPhoneNumber, reqUsername, reqPassword) {
  try {
    await visitorCollection.insertOne({
      firstName: reqFirstName,
      lastName: reqLastName,
      phoneNumber: reqPhoneNumber,
      username: reqUsername,
      password: reqPassword,
    });

    return "Visitor registration successful!";
  } catch (error) {
    console.error('Visitor registration failed:', error);
    return "Error encountered during visitor registration!";
  }
}

// Function to handle visitor login
async function loginVisitor(reqUsername, reqPassword) {
  try {
    const matchVisitors = await visitorCollection.findOne({ username: reqUsername, password: reqPassword });

    if (!matchVisitors) {
      return {
        success: false,
        message: "Visitor not found!",
      };
    } else {
      return {
        success: true,
        visitors: matchVisitors,
      };
    }
  } catch (error) {
    console.error('Error in visitor login:', error);
    return {
      success: false,
      message: "An error occurred during visitor login.",
    };
  }
}


// API Routes

// Login Admin
app.post('/login', (req, res) => {
  let result = login(req.body.username, req.body.password);
  result.then(response => {
    if (response.success) {
      let token = generateAdminToken(response.users);
      res.send("Admin Auth Token: " + token);
    } else {
      res.status(401).send(response.message);
    }
  }).catch(error => {
    console.error('Error in login route:', error);
    res.status(500).send("An error occurred during login.");
  });
});

// Register Admin
app.post('/register', verifyAdminToken, (req, res) => {
  let result = register(req.body.username, req.body.password);
  result.then(response => {
    res.send(response);
  }).catch(error => {
    console.error('Error in register route:', error);
    res.status(500).send("An error occurred during registration.");
  });
});

// Register Visitor
app.post('/registervisitor', (req, res) => {
  let result = registerVisitor(req.body.firstName, req.body.lastName, req.body.phoneNumber, req.body.username, req.body.password);
  result.then(response => {
    res.send(response);
  }).catch(error => {
    console.error('Error in registervisitor route:', error);
    res.status(500).send("An error occurred during visitor registration.");
  });
});

// Login Visitor
app.post('/loginvisitor', (req, res) => {
  let result = loginVisitor(req.body.username, req.body.password);
  result.then(response => {
    if (response.success) {
      let token = generateVisitorToken(response.visitors);
      res.send("Visitor Auth Token: " + token);
    } else {
      res.status(401).send(response.message);
    }
  }).catch(error => {
    console.error('Error in loginvisitor route:', error);
    res.status(500).send("An error occurred during visitor login.");
  });
});


// Add a prisoner
app.post('/addprisoner', verifyAdminToken, (req, res) => {
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
app.get('/visitors', verifyAdminToken, async (req, res) => {
  try {
    const prisoner = await db.collection('visitor').find().toArray();
    res.send(prisoner);
  } catch (error) {
    res.status(500).send('Error viewing visitors');
  }
});

// View all prisoner
app.get('/prisoner', verifyAdminToken, async (req, res) => {
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