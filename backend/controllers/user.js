/**
 * @swagger
 * /profile:
 *   get:
 *     summary: Retrieve a user or admin data based on role.
 *     description: >
 *       Returns the profile information for the authenticated user.
 *       Only users with the role `user` or `admin` can access this endpoint.
 *     tags:
 *       - Profile
 *     security:
 *       - Bearer: []
 *     responses:
 *       200:
 *         description: Successfully retrieved user profile
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Welcome to user dashboard
 *                 user:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: integer
 *                       description: Unique identifier for the user.
 *                       example: 6858e06e21774eeaa6757d28
 *                     name:
 *                       type: string
 *                       description: Full name of the user.
 *                       example: John Doe
 *                     email:
 *                       type: string
 *                       description: Email address of the user.
 *                       example: john@example.com
 *                     role:
 *                       type: string
 *                       description: Role of the user.
 *                       example: user
 *       401:
 *         description: Missing or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Token missing or invalid
 *       403:
 *         description: Forbidden - user does not have permission
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Unauthorized access
 *       404:
 *         description: Not found (user or path)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: User not found
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     Bearer:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

export function getUser(req, res) {
  res.send({
    success: true,
    message: "Welcome to user dashboard",
    user: req.user,
  });
}

