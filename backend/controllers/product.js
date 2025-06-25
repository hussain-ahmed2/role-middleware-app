import Product from "../models/Product.js";

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Retrieve a list of products.
 *     description: Returns an array of all products in the database.
 *     tags:
 *       - Products
 *     responses:
 *       200:
 *         description: Successfully retrieved list of products
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 products:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: Unique identifier for the product.
 *                         example: 60d0fe4f5311236168a109ca
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
 *                   example: Server error
 */

export async function getProducts(req, res) {
  try {
    // Find all products
    const products = await Product.find({});

    res.status(200).json({ success: true, products});
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
}

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Retrieve a single product.
 *     description: Returns a product by its ID.
 *     tags:
 *       - Products
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: 6858f6f927fb2c43baad4689
 *         description: The product ID.
 *     responses:
 *       200:
 *         description: Successfully retrieved the product
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 product:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       description: Unique identifier for the product.
 *                     name:
 *                       type: string
 *                       description: Name of the product.
 *                     description:
 *                       type: string
 *                       description: Description of the product.
 *                     price:
 *                       type: number
 *                       description: Price of the product.
 *       404:
 *         description: Product not found
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
 *                   example: Product not found
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
 *                   example: Server error
 */

export async function getProduct(req, res) {
  try {
    // Destructure the id from the request parameters
    const { id } = req.params;

    // Find the product by id
    const product = await Product.findById(id);

    // Check if the product exists
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    // Return the product
    res.status(200).json({ success: true, product});
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
}

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Create a new product.
 *     description: Creates a new product in the database.
 *     tags:
 *       - Products
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
 *                 description: Name of the product.
 *                 example: Widget
 *               description:
 *                 type: string
 *                 description: Description of the product.
 *                 example: A useful widget for various purposes.
 *               price:
 *                 type: number
 *                 description: Price of the product.
 *                 example: 19.99
 *     responses:
 *       201:
 *         description: Product created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 product:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       description: Unique identifier for the product.
 *                       example: 60d0fe4f5311236168a109ca
 *                     name:
 *                       type: string
 *                       description: Name of the product.
 *                       example: Widget
 *                     description:
 *                       type: string
 *                       description: Description of the product.
 *                       example: A useful widget for various purposes.
 *                     price:
 *                       type: number
 *                       description: Price of the product.
 *                       example: 19.99
 *                 message:
 *                   type: string
 *                   example: Product created successfully
 *       400:
 *         description: Bad request
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
 *                   example: All fields are required or Product already exists
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
 *                   example: Server error
 * */

export async function createProduct(req, res) {
  try {
    // Destructure the name, description, and price from the request body
    const { name, description, price } = req.body;

    // Check if any of the required fields are missing
    if (!name?.trim() || !description?.trim() || !price) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    // Check if a product with the same name already exists
    const existingProduct = await Product.findOne({ name });

    // If a product with the same name already exists, return an error
    if (existingProduct) {
      return res.status(400).json({ success: false, message: "Product already exists" });
    }

    // Create a new product
    const product = await Product.create({ name, description, price });

    res.status(201).json({ success: true, product, message: "Product created successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
}

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Update an existing product.
 *     description: Updates an existing product in the database.
 *     tags:
 *       - Products
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the product to update.
 *         required: true
 *         schema:
 *           type: string
 *           example: 6858f6f927fb2c43baad4689
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the product.
 *                 example: Widget
 *               description:
 *                 type: string
 *                 description: Description of the product.
 *                 example: A useful widget for various purposes.
 *               price:
 *                 type: number
 *                 description: Price of the product.
 *                 example: 19.99
 *     responses:
 *       200:
 *         description: Product updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 product:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       description: Unique identifier for the product.
 *                       example: 60d0fe4f5311236168a109ca
 *                     name:
 *                       type: string
 *                       description: Name of the product.
 *                       example: Widget
 *                     description:
 *                       type: string
 *                       description: Description of the product.
 *                       example: A useful widget for various purposes.
 *                     price:
 *                       type: number
 *                       description: Price of the product.
 *                       example: 19.99
 *                 message:
 *                   type: string
 *                   example: Product updated successfully
 *       400:
 *         description: Bad request
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
 *                   example: All fields are required
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
 *       404:
 *         description: Not found (product)
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
 *                   example: Product not found
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
 *                   example: Server error
 * */

export async function updateProduct(req, res) {
  try {
    const { id } = req.params;
    const { name, description, price } = req.body;

    if (!name?.trim() || !description?.trim() || !price) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    product.name = name;
    product.description = description;
    product.price = price;

    await product.save();

    res.status(200).json({ success: true, product, message: "Product updated successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
}

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Delete a product.
 *     description: Deletes a product from the database.
 *     tags:
 *       - Products
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the product to delete.
 *         required: true
 *         schema:
 *           type: string
 *           example: 6858f6f927fb2c43baad4689
 *     responses:
 *       200:
 *         description: Product deleted successfully
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
 *                   example: Product deleted successfully
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
 *       404:
 *         description: Not found (product)
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
 *                   example: Product not found
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
 *                   example: Server error
 * */

export async function deleteProduct(req, res) {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    await Product.findByIdAndDelete(id);

    res.status(200).json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
}