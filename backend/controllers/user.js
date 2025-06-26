import User from "../models/User.js";
import fs from "fs";
import path from "path";
import { credentialsSchema } from "../../frontend/src/validation/zod-schemas.js";
import { passwordSchema } from "../validation/zod-schemas.js";
import { checkPassword, hashPassword } from "../utils/utils.js";

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
  res.send({
    success: true,
    message: "Welcome to user dashboard",
    user,
  });
}

/**
 * @swagger
 * /profile/avatar:
 *   put:
 *     summary: Update user avatar
 *     description: Allows the authenticated user to update their avatar.
 *     tags:
 *       - Profile
 *     security:
 *       - Bearer: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               avatar:
 *                 type: string
 *                 format: binary
 *                 description: The avatar image file to upload.
 *     responses:
 *       200:
 *         description: Avatar updated successfully
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
 *                   example: Avatar updated successfully
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
 *                        type: string
 *                        description: Path to the uploaded avatar image.
 *                        example: uploads/avatar-1234567890.jpg
 *       400:
 *         description: Upload failed
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
 *                   example: No file uploaded
 *
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

export async function setAvatar(req, res) {
  try {
    // Check if a file was uploaded
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded" });
    }

    // Get the path to the uploaded file
    const avatarPath = `uploads/${req.file.filename}`;

    // Update the user's avatar
    const user = await User.findById(req.user._id).select("-password");

    // Delete the old avatar
    if (user.avatar) {
      const oldAvatarPath = path.join("uploads", path.basename(user.avatar));

      if (fs.existsSync(oldAvatarPath)) {
        fs.unlinkSync(oldAvatarPath);
      }
    }

    // Update the user's avatar
    user.avatar = avatarPath;
    await user.save();

    res.send({
      success: true,
      message: "Avatar updated successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
}

/**
 * @swagger
 * /profile/credentials:
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
    const { name, email } = req.body;

    // validate the request body with zod schema
    const { success, data, error } = credentialsSchema.safeParse({
      name,
      email,
    });

    // Check if the request body is valid
    if (!success)
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: error.flatten().fieldErrors,
      });

    if (data.name === req.user.name && data.email === req.user.email)
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
      _id: { $ne: req.user._id },
    });
    if (userExistsWithEmail)
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: { email: "Email already registered" },
      });

    // Update the user's credentials
    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        name: data.name,
        email: data.email,
      },
      { new: true }
    ).select("-password");

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

/**
 * @swagger
 * /profile/password:
 *   put:
 *     summary: Update user's password
 *     description: Update user's password
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
 *               oldPassword:
 *                 type: string
 *                 description: Old password
 *                 example: oldpassword123
 *               newPassword:
 *                 type: string
 *                 description: New password
 *                 example: newpassword123
 *     responses:
 *       200:
 *         description: Password updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Success status
 *                   example: true
 *                 message:
 *                   type: string
 *                   description: Success message
 *                   example: Password updated successfully
 *                 user:
 *                   type: object
 *                   description: Updated user
 *                   properties:
 *                     name:
 *                       type: string
 *                       description: User's name
 *                       example: John Doe
 *                     email:
 *                       type: string
 *                       description: User's email
 *                       example: john@example.com
 *                     role:
 *                       type: string
 *                       description: User's role
 *                       example: user
 *                     avatar:
 *                       type: string
 *                       description: User's avatar
 *                       example: uploads/1234567890.jpg
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
 *                     oldPassword:
 *                       type: string
 *                       description: Error message for old password field
 *                       example: Old password is required
 *                     newPassword:
 *                       type: string
 *                       description: Error message for new password field
 *                       example: New password is required
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

export async function updatePassword(req, res) {
  try {
    const { oldPassword, newPassword } = req.body;

    // validate the request body with zod schema
    const { success, data, error } = passwordSchema.safeParse({
      oldPassword,
      newPassword,
    });

    if (data.oldPassword === data.newPassword)
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: {
          newPassword: "New password must be different from old password",
        },
      });

    // Check if the request body is valid
    if (!success)
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: error.flatten().fieldErrors,
      });

    // Check if the current password is correct
    const isPasswordValid = await checkPassword(
      data.oldPassword,
      req.user.password
    );
    if (!isPasswordValid)
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: { oldPassword: "Current password is incorrect" },
      });

    // Hash the new password
    const hashedPassword = await hashPassword(newPassword);

    // Update the user's password
    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        password: hashedPassword,
      },
      { new: true }
    ).select("-password");

    res.send({
      success: true,
      message: "Password updated successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
}
