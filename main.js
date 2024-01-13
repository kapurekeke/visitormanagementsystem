/**
 * @openapi
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: Authentication operations
 *   - name: Visitor
 *     description: Visitor operations
 *   - name: Prisoner
 *     description: Prisoner operations
 *   - name: VisitorPass
 *     description: Visitor pass operations
 * 
 */

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Log in as an admin
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successful login
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Register a new admin
 *     tags: [Auth]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Registration successful
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /loginvisitor:
 *   post:
 *     summary: Visitor login endpoint
 *     description: Logs in a visitor and returns an authentication token if successful.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: The username of the visitor.
 *               password:
 *                 type: string
 *                 description: The password of the visitor.
 *     responses:
 *       200:
 *         description: Successful login. Returns a visitor authentication token.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: "Visitor Auth Token: <token>"
 *       401:
 *         description: Unauthorized. Invalid username or password.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: "Invalid username or password."
 *       500:
 *         description: Internal Server Error. An error occurred during login.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: "An error occurred during login."
 */

/**
 * @swagger
 * /registervisitor:
 *   post:
 *     summary: Register as a visitor.
 *     tags: [Visitor]
 *     parameters:
 *       - in: body
 *         name: RequestBody
 *         description: Visitor registration details.
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             firstName:
 *               type: string
 *             lastName:
 *               type: string
 *             phoneNum:
 *               type: string
 *             username:
 *               type: string
 *             password:
 *               type: string
 *     responses:
 *       200:
 *         description: Successful registration.
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: Visitor registration successful!
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: Error encountered during visitor registration!
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 * 
 * security:
 *   - BearerAuth: []
 * 
 * paths:
 *  /addvisitor:
 *    post:
 *     summary: Add a visitor
 *     tags: [Visitor]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               icnumber:
 *                 type: string
 *               relationship:
 *                 type: string
 *               prisonerId:
 *                 type: string
 *               date:
 *                 type: string
 *               time:
 *                 type: string
 *     responses:
 *       200:
 *         description: Visitor added successfully
 *       401:
 *         description: Unauthorized - Invalid token
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /addprisoner:
 *   post:
 *     summary: Add a prisoner
 *     tags: [Prisoner]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               icnumber:
 *                 type: string
 *               prisonerId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Prisoner added successfully
 *       401:
 *         description: Unauthorized - Invalid token
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /visitors:
 *   get:
 *     summary: View all visitors
 *     tags: [Visitor]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of visitors
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /prisoner:
 *   get:
 *     summary: View all prisoners
 *     tags: [Prisoner]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of prisoners
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /visitorspass/{icnum}:
 *   post:
 *     summary: Get visitor's pass information by IC number
 *     description: Retrieve visitor's pass information using the provided IC number.
 *     tags: [VisitorPass]
 *     parameters:
 *       - in: path
 *         name: icnum
 *         required: true
 *         description: The IC number of the visitor.
 *         schema:
 *           type: string
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the operation was successful.
 *                 data:
 *                   type: object
 *                   description: The visitor's pass information.
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the operation was unsuccessful.
 *                 message:
 *                   type: string
 *                   description: Error message.
 */


/**
 * @swagger
 * /visitor/requestpass:
 *   post:
 *     summary: Submit a visitor pass request.
 *     tags: [VisitorPass]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: body
 *         name: RequestBody
 *         description: Visitor pass request details.
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             icNum:
 *               type: string
 *             date:
 *               type: string
 *             time:
 *               type: string
 *             prisonerId:
 *               type: string
 *     responses:
 *       200:
 *         description: Successful request submission.
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: Visitor pass request submitted successfully!
 *               requestId: 1234567890
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: An error occurred while submitting the visitor pass request.
 */

/**
 * @swagger
 * /admin/approvevisitorpass/{requestId}:
 *   put:
 *     summary: Approve or decline a visitor pass request.
 *     tags: [VisitorPass]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: requestId
 *         description: ID of the visitor pass request.
 *         required: true
 *         schema:
 *           type: string
 *       - in: body
 *         name: RequestBody
 *         description: Admin approval details.
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             approvalStatus:
 *               type: string
 *               enum: ['approved', 'declined']
 *     responses:
 *       200:
 *         description: Approval/decline successful.
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: Visitor pass request approved/declined successfully by admin.
 *       404:
 *         description: Visitor pass request not found.
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: Visitor pass request not found.
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: Internal server error.
 */