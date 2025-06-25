import User from "../models/User.js";
import Product from "../models/Product.js";
import Cart from "../models/Cart.js";

/**
 * @swagger
 * /admin:
 *   get:
 *     summary: Retrieve all users and display on admin dashboard.
 *     description: >
 *       Returns all users in the database.
 *       Only users with the role `admin` can access this endpoint.
 *     tags:
 *       - Admin
 *     security:
 *       - Bearer: []
 *     responses:
 *       200:
 *         description: Successfully retrieved all users
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
 *                   example: Welcome to admin dashboard
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       description: Unique identifier for the user.
 *                       example: 1
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
 *                       example: admin
 *                 users:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         description: Unique identifier for the user.
 *                         example: 1
 *                       name:
 *                         type: string
 *                         description: Full name of the user.
 *                         example: John Doe
 *                       email:
 *                         type: string
 *                         description: Email address of the user.
 *                         example: john@example.com
 *                       role:
 *                         type: string
 *                         description: Role of the user.
 *                         example: user
 *                 products:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         description: Unique identifier for the product.
 *                         example: 1
 *                       name:
 *                         type: string
 *                         description: Name of the product.
 *                         example: Widget
 *                       description:
 *                         type: string
 *                         description: Description of the product.
 *                         example: A useful widget for various purposes.
 *                       price:
 *                         type: number
 *                         description: Price of the product.
 *                         example: 19.99
 *                 carts:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         description: Unique identifier for the cart.
 *                         example: 1
 *                       userId:
 *                         type: integer
 *                         description: Unique identifier for the user.
 *                         example: 1
 *                       products:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: integer
 *                               description: Unique identifier for the product.
 *                               example: 1
 *                             productId:
 *                               type: integer
 *                               description: Unique identifier for the product.
 *                               example: 1
 *                             quantity:
 *                               type: integer
 *                               description: Quantity of the product in the cart.
 *                               example: 2
 *       401:
 *         description: Missing or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
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
 *                 message:
 *                   type: string
 *                   example: Unauthorized access
 *       500:
 *         description: Server error
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
 *                   example: Internal Server Error
 *
 */

export async function getAdmin(req, res) {
  try {
    // Find all users
    const users = await User.find({}).select("-password");

    // find all products
    const products = await Product.find({});

    // find all carts
    const carts = await Cart.find({});

    res.send({
      success: true,
      message: "Welcome to admin dashboard",
      user: req.user,
      users,
      products,
      carts,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
}
