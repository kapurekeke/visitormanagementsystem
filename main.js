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
 * /loginvisitor/{icnum}:
 *    post:
 *      summary: Visitor Login
 *      tags: [Visitor]
 *      description: Authenticate a visitor by IC number and generate a JWT token.
 *      parameters:
 *        - name: icnum
 *          in: path
 *          required: true
 *          description: IC number of the visitor
 *          schema:
 *            type: string
 *      responses:
 *        '200':
 *          description: Successful login
 *          content:
 *            application/json:
 *              example:
 *                success: true
 *                message: Visitor login successful!
 *                token: your_generated_token_here
 *        '401':
 *          description: Unauthorized
 *          content:
 *            application/json:
 *              example:
 *                success: false
 *                message: Visitor not found!
 *        '500':
 *          description: Internal server error
 *          content:
 *            application/json:
 *              example:
 *                success: false
 *                message: An error occurred during visitor login.
 */

/**
 * @swagger
 *  /registervisitor:
 *    post:
 *      summary: Visitor Registration
 *      tags: [Visitor]
 *      description: Register a new visitor.
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            example:
 *              name: Visitor Name
 *              icnumber: '123456789012'
 *              relationship: Friend
 *              prisonerId: PrisonerID123
 *              date: '2024-01-15'
 *              time: '14:30'
 *      responses:
 *        '200':
 *          description: Successful registration
 *          content:
 *            application/json:
 *              example: Visitor registration successful!
 *        '500':
 *          description: Internal server error
 *          content:
 *            application/json:
 *              example: An error occurred during visitor registration.
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
 *     summary: Get Visitor Pass
 *     tags: [Visitor]
 *     parameters:
 *       - in: path
 *         name: icnum
 *         required: true
 *         schema:
 *           type: string
 *         description: The IC number of the visitor pass
 *     responses:
 *       '200':
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               user:
 *                 # Your user data structure here
 *       '404':
 *         description: Visitor pass not found
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: Visitor pass not found!
 *       '500':
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: An error occurred.
 */
