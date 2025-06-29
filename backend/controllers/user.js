import User from "../models/User.js";
import { credentialsSchema } from "../validation/zod-schemas.js";
import { checkPassword, hashPassword } from "../utils/utils.js";
import Cart from "../models/Cart.js";

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
 *                     avatar:
 *                       type: string
 *                       description: URL of the user's avatar image.
 *                       example: https://example.com/avatar.jpg
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

export async function getUser(req, res) {
  const user = await User.findById(req.user._id).select("-password");
  const cart = await Cart.findOne({ userId: req.user._id }).populate(
    "products.productId"
  );

  const products = cart?.products.map((product) => ({
    quantity: product.quantity,
    product: product.productId,
  }));

  res.send({
    success: true,
    message: "Welcome to user dashboard",
    user,
    cart: products ?? [],
  });
}

/**
 * @swagger
 * /profile:
 *   put:
 *     summary: Update user credentials
 *     description: Allows the authenticated user to update their credentials.
 *     tags:
 *       - Profile
 *     security:
 *       - Bearer: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Credentials updated successfully
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
 *                   example: Credentials updated successfully
 *                 user:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
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
 *                     avatar:
 *                       type: string
 *                       description: URL of the user's avatar image.
 *                       example: https://example.com/avatar.jpg
 *       400:
 *         description: Validation error
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
 *                   example: Validation error
 *                 errors:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: Name is required
 *                     email:
 *                       type: string
 *                       example: Email is required
 *       500:
 *         description: Server error
 *         content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               success:
 *                 type: boolean
 *                 description: Success status
 *                 example: false
 *               message:
 *                 type: string
 *                 description: Error message
 *                 example: Server error
 *
 */

export async function updateCredentials(req, res) {
  try {
    const { name, email, currentPassword, newPassword, avatar } = req.body;
    const user = req.user;

    // validate the request body with zod schema
    const { success, data, error } = credentialsSchema.safeParse({
      name,
      email,
      currentPassword,
      newPassword,
    });

    // Check if the request body is valid
    if (!success)
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: error.flatten().fieldErrors,
      });

    let avatarPath;

    if (req.file) {
      avatarPath = `uploads/${req.file.filename}`;
      user.avatar = avatarPath;
    }

    if (
      data.name === req.user.name &&
      data.email === req.user.email &&
      !avatarPath &&
      !newPassword &&
      !currentPassword
    )
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: {
          name: "No changes occurred",
          email: "No changes occurred",
        },
      });

    // Check if the user already exists with the same email
    const userExistsWithEmail = await User.findOne({
      email: data.email,
      _id: { $ne: user._id },
    });
    if (userExistsWithEmail)
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: { email: "Email already registered" },
      });

    if (avatar) user.avatar = avatar;

    if (data.newPassword && data.currentPassword) {
      const isPasswordValid = await checkPassword(
        data.currentPassword,
        user.password
      );
      if (!isPasswordValid)
        return res.status(400).json({
          success: false,
          message: "Validation error",
          errors: { currentPassword: "Invalid password" },
        });
      user.password = await hashPassword(data.newPassword);
    }

    // Update the user's credentials
    user.name = data.name;
    user.email = data.email;

    await user.save();

    res.send({
      success: true,
      message: "Credentials updated successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
}
