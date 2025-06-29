import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

/**
 * @swagger
 * /cart:
 *   get:
 *      summary: Retrieve the user's cart.
 *      tags: [Cart]
 *      security:
 *        - Bearer: []
 *      responses:
 *        200:
 *          description: Successfully retrieved the user's cart.
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  success:
 *                    type: boolean
 *                    example: true
 *                  cart:
 *                    type: object
 *                    properties:
 *                      _id:
 *                        type: string
 *                        description: Unique identifier for the cart.
 *                        example: 6858ff38dbbcd76dd04199ab
 *                      userId:
 *                        type: string
 *                        description: Unique identifier for the user.
 *                        example: 6858e06e21774eeaa6757d28
 *                      products:
 *                        type: array
 *                        items:
 *                          type: object
 *                          properties:
 *                            _id:
 *                              type: string
 *                              description: Unique identifier for the product.
 *                              example: 6858ff38dbbcd76dd04199ab
 *                            productId:
 *                              type: object
 *                              properties:
 *                                _id:
 *                                  type: string
 *                                  description: Unique identifier for the product.
 *                                  example: 6858ff38dbbcd76dd04199ab
 *                                name:
 *                                  type: string
 *                                  description: Name of the product.
 *                                  example: Widget
 *                                description:
 *                                  type: string
 *                                  description: Description of the product.
 *                                  example: A useful widget for various purposes.
 *                                price:
 *                                  type: number
 *                                  description: Price of the product.
 *                                  example: 19.99
 *                            quantity:
 *                              type: number
 *                              description: Quantity of the product in the cart.
 *                              example: 1
 *        401:
 *          description: Missing or invalid token
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  success:
 *                    type: boolean
 *                    example: false
 *                  message:
 *                    type: string
 *                    example: Token missing or invalid
 *        404:
 *          description: Cart not found
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  success:
 *                    type: boolean
 *                    example: false
 *                  message:
 *                    type: string
 *                    example: Cart not found
 *        500:
 *          description: Server error
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  success:
 *                    type: boolean
 *                    example: false
 *                  message:
 *                    type: string
 *                    example: Server error
 */

export async function getCart(req, res) {
  try {
    // Find the user's cart
    const cart = await Cart.findOne({ userId: req.user._id }).populate(
      "products.productId"
    );

    const products = cart.products.map((product) => ({
      quantity: product.quantity,
      product: product.productId,
    }));

    res.status(200).json({ success: true, cart: cart || [] });
  } catch (error) {
    console.log(error);
    res.status(500).json({ succes: false, message: "Server error" });
  }
}

/**
 * @swagger
 * /cart:
 *   post:
 *      summary: Add a product to the user's cart.
 *      tags: [Cart]
 *      security:
 *        - Bearer: []
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                productId:
 *                  type: string
 *                  description: Unique identifier for the product.
 *                  example: 6858f6f927fb2c43baad4689
 *      responses:
 *        200:
 *          description: Successfully added the product to the user's cart.
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  success:
 *                    type: boolean
 *                    example: true
 *                  message:
 *                    type: string
 *                    example: Product added to cart successfully
 *                  cart:
 *                    type: object
 *                    properties:
 *                      _id:
 *                        type: string
 *                        description: Unique identifier for the cart.
 *                        example: 60d0fe4f5311236168a109ca
 *                      userId:
 *                        type: string
 *                        description: Unique identifier for the user.
 *                        example: 6858e06e21774eeaa6757d28
 *                      products:
 *                        type: array
 *                        items:
 *                          type: object
 *                          properties:
 *                            productId:
 *                              type: string
 *                              description: Unique identifier for the product.
 *                              example: 6858f6f927fb2c43baad4689
 *                            quantity:
 *                              type: number
 *                              description: Quantity of the product in the cart.
 *                              example: 1
 *        401:
 *          description: Missing or invalid token
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  success:
 *                    type: boolean
 *                    example: false
 *                  message:
 *                    type: string
 *                    example: Token missing or invalid
 *        404:
 *          description: Product not found
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  success:
 *                    type: boolean
 *                    example: false
 *                  message:
 *                    type: string
 *                    example: Product not found
 *        500:
 *          description: Server error
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  success:
 *                    type: boolean
 *                    example: false
 *                  message:
 *                    type: string
 *                    example: Server error
 */

export async function addToCart(req, res) {
  try {
    // Destructure the request body
    const { productId } = req.body;

    // Check if the product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res
        .status(404)
        .json({ succes: false, message: "Product not found" });
    }

    // Find the user's cart
    let cart = await Cart.findOne({ userId: req.user._id }).populate(
      "products.productId"
    );

    // Check if the cart exists
    if (!cart) {
      // if the cart does not exist, create a new one
      cart = new Cart({
        userId: req.user._id,
        products: [{ productId, quantity: 1 }],
      });
    } else {
      // if the cart exists, check if the product is already in the cart
      const productIndex = cart.products.findIndex(
        (item) => item.productId._id.toString() === productId
      );

      // if the product is not in the cart, add it
      if (productIndex === -1) {
        cart.products.push({ productId, quantity: 1 });
      } else {
        // if the product is in the cart, increment the quantity
        cart.products[productIndex].quantity += 1;
      }
    }

    // Save the cart
    await cart.save();

    const newCart = await Cart.findOne({ userId: req.user._id }).populate(
      "products.productId"
    );

    const products = newCart.products.map((product) => ({
      quantity: product.quantity,
      product: product.productId,
    }));

    res.status(200).json({
      success: true,
      message: "Product added to cart successfully",
      cart: products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
}

/**
 * @swagger
 * /cart:
 *   delete:
 *      summary: Remove a product from the user's cart.
 *      tags: [Cart]
 *      security:
 *        - Bearer: []
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                productId:
 *                  type: string
 *                  description: Unique identifier for the product.
 *                  example: 6858f6f927fb2c43baad4689
 *      responses:
 *        200:
 *          description: Successfully removed the product from the user's cart.
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  success:
 *                    type: boolean
 *                    example: true
 *                  message:
 *                    type: string
 *                    example: Product removed from cart successfully
 *                  cart:
 *                    type: object
 *                    properties:
 *                      _id:
 *                        type: string
 *                        description: Unique identifier for the cart.
 *                        example: 60d0fe4f5311236168a109ca
 *                      userId:
 *                        type: string
 *                        description: Unique identifier for the user.
 *                        example: 6858e06e21774eeaa6757d28
 *                      products:
 *                        type: array
 *                        items:
 *                          type: object
 *                          properties:
 *                            productId:
 *                              type: string
 *                              description: Unique identifier for the product.
 *                              example: 6858f6f927fb2c43baad4689
 *                            quantity:
 *                              type: number
 *                              description: Quantity of the product in the cart.
 *                              example: 1
 *        401:
 *          description: Missing or invalid token
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  success:
 *                    type: boolean
 *                    example: false
 *                  message:
 *                    type: string
 *                    example: Token missing or invalid
 *        404:
 *          description: Cart not found or Product not found in cart
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  success:
 *                    type: boolean
 *                    example: false
 *                  message:
 *                    type: string
 *                    example: Cart not found
 *        500:
 *          description: Server error
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  success:
 *                    type: boolean
 *                    example: false
 *                  message:
 *                    type: string
 *                    example: Server error
 *
 */

export async function removeFromCart(req, res) {
  try {
    const { productId } = req.body;

    // Find the user's cart
    const cart = await Cart.findOne({ userId: req.user._id }).populate(
      "products.productId"
    );

    // Check if the cart exists
    if (!cart) {
      return res
        .status(404)
        .json({ success: false, message: "Cart not found" });
    }

    const product = cart.products.find(
      (item) => item.productId._id.toString() === productId
    );

    // Check if the product exists in the cart
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found in cart" });
    }

    // Remove the product from the cart
    cart.products = cart.products.filter(
      (item) => item.productId._id.toString() !== productId
    );

    // Save the cart
    await cart.save();

    const newCart = await Cart.findOne({ userId: req.user._id }).populate(
      "products.productId"
    );

    const products = newCart.products.map((product) => ({
      quantity: product.quantity,
      product: product.productId,
    }));

    res.status(200).json({
      success: true,
      message: "Product removed from cart successfully",
      cart: products || [],
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
}

/**
 * @swagger
 * /cart:
 *   put:
 *      summary: Update the quantity of a product in the user's cart.
 *      tags: [Cart]
 *      security:
 *        - Bearer: []
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                productId:
 *                  type: string
 *                  description: Unique identifier for the product.
 *                  example: 6858f6f927fb2c43baad4689
 *                quantity:
 *                  type: number
 *                  description: Quantity of the product in the cart.
 *                  example: 1
 *      responses:
 *        200:
 *          description: Successfully updated the quantity of the product in the user's cart.
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  success:
 *                    type: boolean
 *                    example: true
 *                  message:
 *                    type: string
 *                    example: Cart updated successfully
 *                  cart:
 *                    type: object
 *                    properties:
 *                      _id:
 *                        type: string
 *                        description: Unique identifier for the cart.
 *                        example: 60d0fe4f5311236168a109ca
 *                      userId:
 *                        type: string
 *                        description: Unique identifier for the user.
 *                        example: 6858e06e21774eeaa6757d28
 *                      products:
 *                        type: array
 *                        items:
 *                          type: object
 *                          properties:
 *                            productId:
 *                              type: string
 *                              description: Unique identifier for the product.
 *                              example: 6858f6f927fb2c43baad4689
 *                            quantity:
 *                              type: number
 *                              description: Quantity of the product in the cart.
 *                              example: 1
 *        400:
 *          description: Quantity must be a positive number
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  success:
 *                    type: boolean
 *                    example: false
 *                  message:
 *                    type: string
 *                    example: Quantity must be greater than 0
 *        401:
 *          description: Missing or invalid token
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  success:
 *                    type: boolean
 *                    example: false
 *                  message:
 *                    type: string
 *                    example: Token missing or invalid
 *        404:
 *          description: Cart not found or Product not found in cart
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  success:
 *                    type: boolean
 *                    example: false
 *                  message:
 *                    type: string
 *                    example: Cart not found
 *        500:
 *          description: Server error
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  success:
 *                    type: boolean
 *                    example: false
 *                  message:
 *                    type: string
 *                    example: Server error
 */

export async function updateCart(req, res) {
  try {
    const { productId, quantity } = req.body;

    // Find the user's cart
    const cart = await Cart.findOne({ userId: req.user._id }).populate(
      "products.productId"
    );

    // Check if the cart exists
    if (!cart) {
      return res
        .status(404)
        .json({ success: false, message: "Cart not found" });
    }

    // Update the quantity of the product in the cart
    const productIndex = cart.products.findIndex(
      (item) => item.productId._id.toString() === productId
    );

    if (productIndex === -1) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found in cart" });
    }

    if (quantity <= 0) {
      return res
        .status(400)
        .json({ success: false, message: "Quantity must be greater than 0" });
    }

    cart.products[productIndex].quantity = quantity;

    // Save the cart
    await cart.save();

    const newCart = await Cart.findOne({ userId: req.user._id }).populate(
      "products.productId"
    );

    const products = newCart.products.map((product) => ({
      quantity: product.quantity,
      product: product.productId,
    }));

    res.status(200).json({
      success: true,
      message: "Cart updated successfully",
      cart: products || [],
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
}
