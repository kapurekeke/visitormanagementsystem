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
 *  /createvisitorData:
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
 *     responses:
 *       200:
 *         description: List of prisoners
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /visitorpass:
 *  post:
 *    summary: Retrieve visitor information by IC number
 *     tags: [Visitor]
 *    consumes:
 *      - application/json
 *    produces:
 *      - application/json
 *    parameters:
 *       - in: body
 *        name: requestBody
 *         description: Visitor IC number
 *        required: true
 *         schema:
 *          type: object
 *           properties:
 *            icnumber:
 *               type: string
 *    responses:
 *       200:
 *        description: Successful response
 *         schema:
 *          type: object
 *          properties:
 *             success:
 *              type: boolean
 *              description: Indicates whether the operation was successful
 *             // Add other properties based on the actual response structure
 *      401:
 *        description: Unauthorized. Incorrect IC number.
 *        schema:
 *          type: string
 *      500:
*       description: Internal Server Error
 *         schema:
  *          type: string
 */

