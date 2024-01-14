const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const swaggerui = require('swagger-ui-express');
const jwt = require('jsonwebtoken');
const swaggerjsdoc = require('swagger-jsdoc');

const app = express();
const port = process.env.PORT || 3000;
const { ObjectId } = require('mongodb');
const bcrypt = require('bcryptjs');

// MongoDB connection URL
//const uri = "mongodb+srv://hajimu69:hAZimFAhm1kaYKaY24@cluster1.gljgb6e.mongodb.net/";
const uri = "mongodb+srv://b022120050:hazim123456789@cluster0.jfboppa.mongodb.net/";

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

  jwt.verify(token, '@dMinp@ssw0RD', function (err, decoded) {
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

  jwt.verify(token, 'vISit0rP@@sw0rd', function (err, decoded) {
    if (err) {
      return res.status(401).send('Invalid Token');
    }

    req.user = decoded;
    next();
  });
}

// Function to generate admin JWT token
function generateAdminToken(userData) {
  const token = jwt.sign(userData, '@dMinp@ssw0RD');
  return token;
}

// Function to generate visitor token
function generateVisitorToken(visitorData) {
  const token = jwt.sign(visitorData, 'vISit0rP@@sw0rd');
  return token;
}

// Function to handle admin login with password hashing using bcryptjs
async function login(reqUsername, reqPassword) {
  try {
    const admin = await adminCollection.findOne({ username: reqUsername });

    if (!admin) {
      return {
        success: false,
        message: "Admin not found!",
      };
    }

    const passwordMatch = await bcrypt.compare(reqPassword, admin.password);

    if (passwordMatch) {
      return {
        success: true,
        users: admin,
      };
    } else {
      return {
        success: false,
        message: "Invalid password!",
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

// Function to register admin with hashed password using bcryptjs
async function register(reqUsername, reqPassword) {
  try {
    const hashedPassword = await bcrypt.hash(reqPassword, 10); // 10 is the number of salt rounds

    await adminCollection.insertOne({
      username: reqUsername,
      password: hashedPassword,
    });

    return "Registration successful!";
  } catch (error) {
    console.error('Registration failed:', error);
    return "Error encountered!";
  }
}

// Function to register visitor with hashed password using bcryptjs
async function registerVisitor(reqFirstName, reqLastName, reqPhoneNumber, reqUsername, reqPassword) {
  try {
    const hashedPassword = await bcrypt.hash(reqPassword, 10); // 10 is the number of salt rounds

    await visitorCollection.insertOne({
      firstName: reqFirstName,
      lastName: reqLastName,
      phoneNumber: reqPhoneNumber,
      username: reqUsername,
      password: hashedPassword,
    });

    return "Visitor registration successful!";
  } catch (error) {
    console.error('Visitor registration failed:', error);
    return "Error encountered during visitor registration!";
  }
}

// Function to handle visitor login with password hashing using bcryptjs
async function loginVisitor(reqUsername, reqPassword) {
  try {
    const visitor = await visitorCollection.findOne({ username: reqUsername });

    if (!visitor) {
      return {
        success: false,
        message: "Visitor not found!",
      };
    }

    const passwordMatch = await bcrypt.compare(reqPassword, visitor.password);

    if (passwordMatch) {
      return {
        success: true,
        visitors: visitor,
      };
    } else {
      return {
        success: false,
        message: "Invalid password!",
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

// Function to handle visitor pass request
async function requestVisitorPass(visitorId, reason) {
  try {
    // Assuming you have a collection named 'visitorPass' to store pass requests
    await db.collection('visitorPass').insertOne({
      visitorId,
      reason,
      status: 'Pending', // Initial status when requested
    });

    return "Visitor pass request submitted successfully!";
  } catch (error) {
    console.error('Error in requesting visitor pass:', error);
    return "Error encountered during visitor pass request!";
  }
}

// Function to handle admin approval or denial of visitor pass
async function approveDenyVisitorPass(passId, decision) {
  try {
    // Assuming you have a collection named 'visitorPass' to store pass requests
    const passObjectId = new ObjectId(passId);
    const pass = await db.collection('visitorPass').findOne({ _id: passObjectId });

    if (!pass) {
      return {
        success: false,
        message: "Visitor pass not found!",
      };
    }

    const updateResult = await db.collection('visitorPass').updateOne(
      { _id: passObjectId },
      { $set: { status: decision } }
    );

    if (updateResult.matchedCount === 1) {
      return {
        success: true,
        message: `Visitor pass ${decision.toLowerCase()} successfully!`,
      };
    } else {
      return {
        success: false,
        message: "Error updating visitor pass status!",
      };
    }
  } catch (error) {
    console.error('Error in approving/denying visitor pass:', error);
    return {
      success: false,
      message: "An error occurred during approval/denial of visitor pass.",
    };
  }
}


// Function to check the status of visitor pass
async function checkVisitorPassStatus(visitorId) {
  try {
    // Assuming you have a collection named 'visitorPass' to store pass requests
    const pass = await db.collection('visitorPass').findOne({ visitorId });

    if (!pass) {
      return {
        success: false,
        message: "Visitor pass not found!",
      };
    }

    return {
      success: true,
      status: pass.status,
    };
  } catch (error) {
    console.error('Error in checking visitor pass status:', error);
    return {
      success: false,
      message: "An error occurred during the status check of visitor pass.",
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
    const visitor = await db.collection('visitor').find().toArray();
    res.send(visitor);
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

// API to request a visitor pass
app.post('/requestpass', verifyVisitorToken, (req, res) => {
  const { reason } = req.body;
  const visitorId = req.user._id; // Assuming visitor information is stored in the token

  let result = requestVisitorPass(visitorId, reason);
  result.then(response => {
    res.send(response);
  }).catch(error => {
    console.error('Error in requestpass route:', error);
    res.status(500).send("An error occurred during visitor pass request.");
  });
});

// API to approve or deny a visitor pass
app.post('/approvedenypass/:passId', verifyAdminToken, (req, res) => {
  const { decision } = req.body;
  const passId = req.params.passId;

  let result = approveDenyVisitorPass(passId, decision);
  result.then(response => {
    if (response.success) {
      res.send(response.message);
    } else {
      res.status(404).send(response.message);
    }
  }).catch(error => {
    console.error('Error in approvedenypass route:', error);
    res.status(500).send("An error occurred during approval/denial of visitor pass.");
  });
});

// API to check the status of a visitor pass
app.get('/checkpassstatus', verifyVisitorToken, (req, res) => {
  const visitorId = req.user._id; // Assuming visitor information is stored in the token

  let result = checkVisitorPassStatus(visitorId);
  result.then(response => {
    if (response.success) {
      res.send(`Visitor pass status: ${response.status}`);
    } else {
      res.status(404).send(response.message);
    }
  }).catch(error => {
    console.error('Error in checkpassstatus route:', error);
    res.status(500).send("An error occurred during the status check of visitor pass.");
  });
});

// View all visitor pass requests
app.get('/visitorpass', verifyAdminToken, async (req, res) => {
  try {
    const visitorpass = await db.collection('visitorPass').find().toArray();
    res.send(visitorpass);
  } catch (error) {
    res.status(500).send('Error viewing visitor pass requests');
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