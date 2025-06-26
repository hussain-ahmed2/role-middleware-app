import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * @swagger
 * /avatars:
 *   get:
 *     summary: Get all user avatars
 *     description: Get all user avatar images
 *     responses:
 *       200:
 *         description: List of avatar URLs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 *                 format: uri
 *       500:
 *         description: Failed to load avatars
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 *                   example: Failed to load avatars
 */
export async function getAvatars(req, res) {
  try {
    const avatarDir = path.join(__dirname, "..", "public", "avatars");

    fs.readdir(avatarDir, (err, files) => {
      if (err) return res.status(500).json({ error: "Failed to load avatars" });

      const avatarUrls = files.map((file) => `avatars/${file}`);
      res.json(avatarUrls);
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to load avatars" });
  }
}
