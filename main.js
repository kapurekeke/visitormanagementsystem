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
 * /registervisitor:
 *   post:
 *     summary: Register a new visitor
 *     tags: [Visitor]
 *     requestBody:
 *       description: Visitor registration details
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Successful registration
 *       '500':
 *         description: Internal server error
 */

/**
 * @swagger
 * /loginvisitor:
 *   post:
 *     summary: Login as a visitor
 *     tags: [Visitor]
 *     requestBody:
 *       description: Visitor login details
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
 *       '200':
 *         description: Successful login
 *       '401':
 *         description: Unauthorized - Invalid credentials
 *       '500':
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
 * /requestpass:
 *   post:
 *     summary: Request a visitor pass.
 *     description: Allows a visitor to request a pass.
 *     tags: [VisitorPass]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reason:
 *                 type: string
 *             required:
 *               - reason
 *     responses:
 *       200:
 *         description: Success message.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /approvedenypass/{passId}:
 *   post:
 *     summary: Approve or deny a visitor pass.
 *     description: Allows an admin to approve or deny a visitor pass.
 *     tags: [VisitorPass]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: passId
 *         in: path
 *         description: ID of the visitor pass to be approved or denied.
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               decision:
 *                 type: string
 *             required:
 *               - decision
 *     responses:
 *       200:
 *         description: Success message.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       404:
 *         description: Visitor pass not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /checkpassstatus:
 *   get:
 *     summary: Check the status of a visitor pass.
 *     description: Allows a visitor to check the status of their pass.
 *     tags: [VisitorPass]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Visitor pass status.
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       404:
 *         description: Visitor pass not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /visitorpass:
 *   get:
 *     summary: View all visitors pass requests
 *     tags: [VisitorPass]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of visitors pass requests
 *       500:
 *         description: Internal server error
 */