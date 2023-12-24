/**
 * @openapi
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: Authentication operations
 *   - name: Admin
 *     description: Admin operations
 *   - name: Visitor
 *     description: Visitor operations
 *   - name: Prisoner
 *     description: Prisoner operations
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
 * tags:
 *   name: Visitor
 *   description: Operations related to visitors
 */


/**
 * @swagger
 * /createvisitorData:
 *   post:
 *     summary: Add a visitor
 *     tags: [Visitor]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       description: Visitor data to be added
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Visitor's name
 *               icnumber:
 *                 type: string
 *                 description: Visitor's IC number
 *               relationship:
 *                 type: string
 *                 description: Relationship with the prisoner
 *               prisonerId:
 *                 type: string
 *                 description: ID of the prisoner
 *             required:
 *               - name
 *               - icnumber
 *               - relationship
 *               - prisonerId
 *     responses:
 *       '200':
 *         description: Successful operation
 *         content:
 *           application/json:
 *             example:
 *               name: John Doe
 *               icnumber: 123456789
 *               relationship: Family
 *               prisonerId: ABC123
 *       '500':
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             example:
 *               error: An error occurred while creating the visitor
 *     security:
 *       - BearerAuth: []
 */
