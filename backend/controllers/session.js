import User from "../models/User.js";
import { checkPassword, generateToken, hashPassword } from "../utils/utils.js";
import { loginSchema, registerSchema } from "../validation/zod-schemas.js";

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Login user.
 *     description: >
 *       Returns a JSON Web Token (JWT) if the credentials are valid.
 *     tags:
 *       - Session
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Email address of the user.
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 description: Password of the user.
 *                 example: password
 *     responses:
 *       200:
 *         description: Successfully logged in and returned a JWT
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Success status
 *                   example: true
 *                 token:
 *                   type: string
 *                   description: JSON Web Token
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InVzZXJAZXhhbXBsZS5jb20iLCJpZGVudGl0eSI6IjEiLCJpYXQiOjE2MzYyNzg5NzgsImV4cCI6MTYzNjI4MjczOH0.0cFV3fQvJqJh5b6h5b6h5b6h
 *                 user:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       description: Full name of the user.
 *                       example: John Doe
 *                     role:
 *                       type: string
 *                       description: Role of the user.
 *                       example: user
 *                     email:
 *                       type: string
 *                       description: Email address of the user.
 *                       example: john@example.com
 *                     avatar:
 *                       type: string
 *                       description: URL of the user's avatar image.
 *                       example: https://example.com/avatar.jpg
 *                 message:
 *                   type: string
 *                   description: Success message
 *                   example: Successfully logged in
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Success status
 *                   example: false
 *                 message:
 *                   type: string
 *                   description: Error message
 *                   example: Validation error
 *                 errors:
 *                   type: object
 *                   properties:
 *                     email:
 *                       type: string
 *                       description: Error message for email field
 *                       example: Email is required or Invalid email format
 *                     password:
 *                       type: string
 *                       description: Error message for password field
 *                       example: Password is required or Password must be at least 8 characters long
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Success status
 *                   example: false
 *                 message:
 *                   type: string
 *                   description: Error message
 *                   example: Invalid credentials
 *                 errors:
 *                   type: object
 *                   properties:
 *                     email:
 *                       type: string
 *                       description: Error message for email field
 *                       example: Email is not registered
 *                     password:
 *                       type: string
 *                       description: Error message for password field
 *                       example: Password is incorrect
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Success status
 *                   example: false
 *                 message:
 *                   type: string
 *                   description: Error message
 *                   example: Server error
 */

export const loginUser = async (req, res) => {
  try {
    // Destructure the request body
    const { email, password } = req.body;

    // validate the request body with zod schema
    const { success, data, error } = loginSchema.safeParse(req.body);
    if (!success)
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: error.flatten().fieldErrors,
      });

    // Find the user by email
    const user = await User.findOne({ email: data.email });

    // Check if the user exists
    if (!user)
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
        errors: { email: "Email is not registered" },
      });

    // check the password
    const isPasswordValid = await checkPassword(password, user.password);

    // Check if the password is valid
    if (!isPasswordValid)
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
        errors: { password: "Password is incorrect" },
      });

    // Generate a JWT
    const token = generateToken({ id: user._id });

    res.send({
      success: true,
      token,
      message: "Successfully logged in",
      user: {
        name: user.name,
        role: user.role,
        email: user.email,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Register user.
 *     description: >
 *       Returns a JSON Web Token (JWT) if the credentials are valid.
 *     tags:
 *       - Session
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the user.
 *                 example: John Doe
 *               password:
 *                 type: string password
 *                 description: Password of the user.
 *                 example: password
 *               email:
 *                 type: string
 *                 description: Email address of the user.
 *                 example: john@example.com
 *     responses:
 *       200:
 *         description: Successfully registered and returned a JWT
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Success status
 *                   example: true
 *                 token:
 *                   type: string
 *                   description: JSON Web Token
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InVzZXJAZXhhbXBsZS5jb20iLCJpZGVudGl0eSI6IjEiLCJpYXQiOjE2MzYyNzg5NzgsImV4cCI6MTYzNjI4MjczOH0.0cFV3fQvJqJh5b6h5b6h5b6h
 *                 user:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       description: Name of the user.
 *                       example: John Doe
 *                     role:
 *                       type: string
 *                       description: Role of the user.
 *                       example: user
 *                     email:
 *                       type: string
 *                       description: Email address of the user.
 *                       example: john@example.com
 *                     avatar:
 *                       type: string
 *                       description: URL of the user's avatar image.
 *                       example: https://example.com/avatar.jpg
 *                 message:
 *                   type: string
 *                   description: Success message
 *                   example: Successfully registered
 *       400:
 *         description: Already registered or validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Success status
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Already registered
 *                 errors:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: array
 *                       items:
 *                         type: string
 *                         example: Name is required
 *                     password:
 *                       type: array
 *                       items:
 *                         type: string
 *                         example: Password is required
 *                     email:
 *                       type: array
 *                       items:
 *                         type: string
 *                         example: Invalid email format or Email already registered
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Success status
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Server error
 */

export const registerUser = async (req, res) => {
  try {
    // Destructure the request body
    const { name, password, email } = req.body;
    const avatar = req.file ? req.file.path : null;

    // validate the request body with zod schema
    const { success, data, error } = registerSchema.safeParse(req.body);
    if (!success)
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: {
          ...error.formErrors.fieldErrors,
          avatar: "Avatar is required",
        },
      });

    if (!avatar)
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: {
          avatar: "Avatar is required",
        },
      });

    // Find all users
    const users = await User.find({});

    // Find the user by email
    const userExists = users.find((item) => item.email === data.email);

    // Check if the user already exists
    if (userExists)
      return res.status(400).json({
        success: false,
        message: "Already registered",
        errors: { email: "Email already registered" },
      });

    // Hash the password
    const hashedPassword = await hashPassword(password);

    // Create a new user
    const user = await User.create({
      name,
      password: hashedPassword,
      email,
      avatar,
    });

    // Generate a JWT
    const token = generateToken({ id: user._id });

    // Send the response
    res.send({
      success: true,
      token,
      user: { name, email, role: user.role, avatar: user.avatar },
      message: "Successfully registered",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
