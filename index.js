const express = require('express')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 3000;
const swaggerui = require('swagger-ui-express');
const jwt = require('jsonwebtoken');
const swaggerjsdoc = require('swagger-jsdoc');

app.use(express.json())

// MongoDB connection URL
const uri = "mongodb+srv://hajimu69:hAZimFAhm1kaYKaY24@cluster1.gljgb6e.mongodb.net/";

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
const visitorPassCollection = db.collection('visitorpass');

/**login admin function*/
async function login(reqUsername, reqPassword) {
    return adminCollection.findOne({ username: reqUsername, password: reqPassword })
      .then(matchUsers => {
        if (!matchUsers) {
          return {
            success: false,
            message: "Admin not found!"
          };
        } else {
          return {
            success: true,
            users: matchUsers
          };
        }
      })
      .catch(error => {
          console.error('Error in login:', error);
          return {
            success: false,
            message: "An error occurred during login."
          };
        });
}

// Visitor pass function
async function visitorspass(reqicnum) {
  try {
    const matchedUser = await visitorPassCollection.findOne({ icnumber: reqicnum });

    if (matchedUser) {
      return {
        success: true,
        message: {
          status: matchedUser.status || 'pending',
          details: matchedUser,
        },
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

// Visitor pass request function
async function requestVisitorPass(reqIcNum, reqDate, reqTime, reqPrisonerId) {
  const requestDetails = {
    icNum: reqIcNum,
    date: reqDate,
    time: reqTime,
    prisonerId: reqPrisonerId,
    status: 'pending', // Initial status is set to pending
    approvedByAdmin: null, // Admin approval information
  };

  try {
    const result = await visitorPassCollection.insertOne(requestDetails);
    return {
      success: true,
      message: 'Visitor pass request submitted successfully!',
      requestId: result.insertedId,
    };
  } catch (error) {
    console.error('Error submitting visitor pass request:', error);
    return {
      success: false,
      message: 'An error occurred while submitting the visitor pass request.',
    };
  }
}

async function approveVisitorPass(requestId, approvalStatus) {
  try {
    const updatedRequest = await visitorPassCollection.findOneAndUpdate(
      { _id: ObjectId(requestId) },
      { $set: { status: approvalStatus, approvedByAdmin: req.user.username } },
      { returnDocument: 'after' }
    );

    if (updatedRequest.value) {
      return {
        success: true,
        message: `Visitor pass request ${approvalStatus === 'approved' ? 'approved' : 'declined'} successfully by admin.`,
      };
    } else {
      return {
        success: false,
        message: 'Visitor pass request not found.',
      };
    }
  } catch (error) {
    console.error('Error approving/declining visitor pass request:', error);
    return {
      success: false,
      message: 'Internal server error',
    };
  }
}

//visitor login function
async function visitorLogin(reqUsername, reqPassword) {
  try {
    const matchedUsers = await visitorCollection.findOne({ username: reqUsername, password: reqPassword });

    if (!matchedUsers) {
      return {
        success: false,
        message: "Visitor not found!",
      };
    } else {
      return {
        success: true,
        users: matchedUsers,
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



/**create admin function */
async function register(reqUsername, reqPassword) {
    return adminCollection.insertOne({
      username: reqUsername,
      password: reqPassword,
      
    })
      .then(() => {
        return "Registration successful!";
      })
      .catch(error => {
        console.error('Registration failed:', error);
        return "Error encountered!";
      });
}

//create visitor function
async function visitorRegister(reqFirstName, reqLastName, reqPhoneNum, reqUsername, reqPassword) {
  return visitorCollection.insertOne({
    firstName: reqFirstName,
    lastName: reqLastName,
    phoneNum: reqPhoneNum,
    username: reqUsername,
    password: reqPassword,
  })
  .then(() => {
    return "Visitor registration successful!";
  })
  .catch(error => {
    console.error('Visitor registration failed:', error);
    return "Error encountered during visitor registration!";
  });
}

function generateAdminToken(userData) {
  const token = jwt.sign(userData, 'adminSecretKey');
  return token;
}

function generateVisitorToken(userData) {
  const token = jwt.sign(userData, 'visitorSecretKey');
  return token;
}

function verifyAdminToken(req, res, next) {
  let header = req.headers.authorization;

  // Check if the Authorization header is present
  if (!header) {
    return res.status(401).send('Authorization header is missing');
  }

  console.log(header);

  // Split the header to extract the token
  let tokenParts = header.split(' ');

  // Check if the expected token format is present
  if (tokenParts.length !== 2 || tokenParts[0].toLowerCase() !== 'bearer') {
    return res.status(401).send('Invalid Authorization header format');
  }

  let token = tokenParts[1];

  jwt.verify(token, 'adminSecretKey', function (err, decoded) {
    if (err) {
      return res.status(401).send('Invalid Token');
    }

    req.user = decoded;
    next();
  });
}

function verifyVisitorToken(req, res, next) {
  let header = req.headers.authorization;

  // Check if the Authorization header is present
  if (!header) {
    return res.status(401).send('Authorization header is missing');
  }

  console.log(header);

  // Split the header to extract the token
  let tokenParts = header.split(' ');

  // Check if the expected token format is present
  if (tokenParts.length !== 2 || tokenParts[0].toLowerCase() !== 'bearer') {
    return res.status(401).send('Invalid Authorization header format');
  }

  let token = tokenParts[1];

  jwt.verify(token, 'visitorSecretKey', function (err, decoded) {
    if (err) {
      return res.status(401).send('Invalid Token');
    }

    req.user = decoded;
    next();
  });
}

// Login Admin
app.post('/login', (req, res) => {
    console.log(req.body);
  
    let result = login(req.body.username, req.body.password);
    result.then(response => {
      console.log(response); // Log the response received
  
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

//visitor register
app.post('/registervisitor', (req, res) => {
  console.log(req.body);

  let result = visitorRegister(req.body.firstName, req.body.lastName, req.body.phoneNum, req.body.username, req.body.password);
  result.then(response => {
    res.send(response);
  }).catch(error => {
    console.error('Error in register route:', error);
    res.status(500).send("An error occurred during registration.");
  });
});

//visitor login
app.post('/loginvisitor', async(req, res) => {
  console.log(req.body);

  let result = visitorLogin(req.body.username, req.body.password);
  result.then(response => {
    console.log(response); // Log the response received

    if (response.success) {
      let token = generateVisitorToken(response.users);
      res.send("Visitor Auth Token: " + token);
    } else {
      res.status(401).send(response.message);
    }
  }).catch(error => {
    console.error('Error in login route:', error);
    res.status(500).send("An error occurred during login.");
  });
});



// visitor pass
app.post('/visitorspass/:icnum', verifyVisitorToken, async (req, res) => {
  const { icnum } = req.params;

  try {
    const result = await visitorspass(icnum);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Visitor request visitor pass
app.post('/visitor/requestpass', verifyVisitorToken, async (req, res) => {
  const { icNum, date, time, prisonerId } = req.body;

  try {
    const result = await requestVisitorPass(icNum, date, time, prisonerId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Admin approve/decline visitor pass request
app.put('/admin/approvevisitorpass/:requestId', verifyAdminToken, async (req, res) => {
  const { requestId } = req.params;
  const { approvalStatus } = req.body;

  try {
    const updatedRequest = await visitorPassCollection.findOneAndUpdate(
      { _id: ObjectId(requestId) },
      { $set: { status: approvalStatus, approvedByAdmin: req.user.username } },
      { returnDocument: 'after' }
    );

    if (updatedRequest.value) {
      res.json({
        success: true,
        message: `Visitor pass request ${approvalStatus === 'approved' ? 'approved' : 'declined'} successfully by admin.`,
      });
    } else {
      res.status(404).json({ success: false, message: 'Visitor pass request not found.' });
    }
  } catch (error) {
    console.error('Error approving/declining visitor pass request:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});


// Register Admin
app.post('/register', verifyAdminToken, (req, res) => {
    console.log(req.body);
  
    let result = register(req.body.username, req.body.password, req.body.name, req.body.email);
    result.then(response => {
      res.send(response);
    }).catch(error => {
      console.error('Error in register route:', error);
      res.status(500).send("An error occurred during registration.");
    });
});


// Add a visitor
app.post('/addvisitor', verifyAdminToken, (req, res) => {
    const {
      name,
      icnumber,
      relationship,
      prisonerId,
      date,
      time
    } = req.body;
  
    const visitorData = {
      name,
      icnumber,
      relationship,
      prisonerId,
      date,
      time
    };
  
    visitorCollection
      .insertOne(visitorData)
      .then(() => {
        res.send(visitorData);
      })
      .catch((error) => {
        console.error('Error adding visitor:', error);
        res.status(500).send('An error occurred while adding the visitor');
      });
});


// Add a prisoner
app.post('/addprisoner', verifyAdminToken, (req, res) => {
    const {
      name,
      icnumber,
      prisonerId
    } = req.body;
  
    const prisonerData = {
      name,
      icnumber,
      prisonerId
    };
  
    prisonerCollection
      .insertOne(prisonerData)
      .then(() => {
        res.send(prisonerData);
      })
      .catch((error) => {
        console.error('Error creating prisoner:', error);
        res.status(500).send('An error occurred while creating the prisoner');
      });
});

// View all visitors
app.get('/visitors',verifyAdminToken, async (req, res) => {
    try {
      const db = client.db('vms');
      const prisoner = await db.collection('visitor').find().toArray();
      res.send(prisoner);
    } catch (error) {
      res.status(500).send('Error viewing visitors');
    }
});

// View all prisoner
app.get('/prisoner', verifyAdminToken, async (req, res) => {
    try {
      const db = client.db('vms');
      const prisoner = await db.collection('prisoner').find().toArray();
      res.send(prisoner);
    } catch (error) {
      res.status(500).send('Error viewing prisoner');
    }
  });

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

app.listen(port, () => {
   console.log(`Example app listening on port ${port}`)
})
