// Libraries
const router = require('express').Router();
const Product = require('../models/Product');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const authenticate = require('../middleware/authenticate');
const { check, validationResult } = require('express-validator');
const Challenge = require('../models/Challenge');

// GET: All products
router.get("/products", async (req, res) => {
  try {
    const productsData = await Product.find();
    res.status(200).json(productsData);
  } catch (error) {
    console.error("Fetch all products error:", error);
    res.status(500).json({ status: false, message: "Failed to fetch products" });
  }
});

// GET: Product by id
router.get("/product/:id", async (req, res) => {
  try {
    const { id } = req.params;
    let individualData;

    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      individualData = await Product.findById(id);
    }

    if (!individualData) {
      individualData = await Product.findOne({ id: parseInt(id) });
    }

    if (!individualData) {
      return res.status(404).json({ status: false, message: "Product not found" });
    }

    res.status(200).json(individualData);
  } catch (error) {
    console.error("Fetch individual product error:", error);
    res.status(500).json({ status: false, message: "Error fetching product", error: error.message });
  }
});

// POST: Register user
// Register route with uniqueness handled by MongoDB
router.post('/register', [

  check('name')
    .not().isEmpty().withMessage("Name can't be empty")
    .trim().escape(),

  check('number')
    .not().isEmpty().withMessage("Number can't be empty")
    .isNumeric().withMessage("Number must only consist of digits")
    .isLength({ max: 10, min: 10 }).withMessage('Number must consist of 10 digits'),

  check('password')
    .not().isEmpty().withMessage("Password can't be empty")
    .isLength({ min: 8 }).withMessage("Password must be at least 8 characters long")
    .matches(/[a-z]/).withMessage("Password must contain a lowercase letter")
    .matches(/[A-Z]/).withMessage("Password must contain an uppercase letter")
    .matches(/[0-9]/).withMessage("Password must contain a number")
    .matches(/[!@#$%^&*(),.?":{}|<>]/).withMessage("Password must contain a special character"),

  check('confirmPassword')
    .not().isEmpty().withMessage("Confirm Password can't be empty"),

  check('email')
    .not().isEmpty().withMessage("Email can't be empty")
    .isEmail().withMessage("Email format is invalid")
    .normalizeEmail()

], async function(req, res) {
  const validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    return res.status(400).json({
      status: false,
      message: validationErrors.array()
    });
  }

  const { name, number, email, password, confirmPassword } = req.body;
  const customErrors = [];

  if (password !== confirmPassword) {
    customErrors.push({ msg: "Passwords don't match" });
    return res.status(400).json({ status: false, message: customErrors });
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      number,
      email,
      password: hashedPassword,
      location: '',
      carbonSaved: 0,
      ecoScore: 0,
      circularityScore: 0,
      moneySaved: 0,
      currentChallenges: [],
      badges: []
    });

    const savedUser = await newUser.save();

    res.status(201).json({
  status: true,
  message: "User registered successfully",
  user: savedUser // optional
});

  } catch (error) {
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      const msg = `${field.charAt(0).toUpperCase() + field.slice(1)} already registered`;
      return res.status(400).json({
        status: false,
        message: [{ msg }]
      });
    }

    console.log(error);
    return res.status(500).json({
      status: false,
      message: "Internal server error"
    });
  }
});


// POST: Login
router.post('/login', [
  check('email')
    .notEmpty().withMessage("Email can't be empty")
    .isEmail().withMessage("Email format is invalid")
    .normalizeEmail(),

  check('password')
    .notEmpty().withMessage("Password can't be empty")
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      status: false, 
      message: errors.array() 
    });
  }

  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ 
        status: false, 
        message: [{ msg: "Incorrect Email or Password" }] 
      });
    }

    const token = await user.generateAuthToken();
    res.cookie("AmazonClone", token, {
      expires: new Date(Date.now() + 3600000),
      httpOnly: true
    });

    res.status(201).json({ 
      status: true, 
      message: "Logged in successfully!" 
    });

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ 
      status: false, 
      message: [{ msg: "Internal server error" }] 
    });
  }
});

// POST: Add to cart
router.post('/addtocart/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    let product = id.match(/^[0-9a-fA-F]{24}$/)
      ? await Product.findById(id)
      : await Product.findOne({ id: parseInt(id) });

    if (!product) {
      return res.status(404).json({ status: false, message: "Product not found" });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(400).json({ status: false, message: "Invalid User" });
    }

    const cartItem = user.cart.find(item => item.id == product.id);
    if (cartItem) {
      await User.updateOne(
        { _id: req.userId, 'cart.id': product.id },
        { $inc: { 'cart.$.qty': 1 } }
      );
    } else {
      await user.addToCart(product.id, product);
    }

    const updatedUser = await User.findById(req.userId);
    res.status(201).json({ status: true, message: updatedUser });

  } catch (error) {
    console.error("Add to cart error:", error);
    res.status(500).json({ status: false, message: "Error adding item to cart", error: error.message });
  }
});

// DELETE: Remove item from cart
router.delete("/delete/:id", authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(req.userId);
    user.cart = user.cart.filter(item => item.id != id);
    await user.save();

    res.status(201).json({ status: true, message: "Item deleted successfully" });
  } catch (err) {
    console.error("Delete item error:", err);
    res.status(400).json({ status: false, message: err.message });
  }
});

// GET: Logout
router.get("/logout", authenticate, async (req, res) => {
  try {
    req.rootUser.tokens = req.rootUser.tokens.filter(tokenObj => tokenObj.token !== req.token);
    res.clearCookie("AmazonClone");
    await req.rootUser.save();
    res.status(201).json({ status: true, message: "Logged out successfully!" });
  } catch (err) {
    console.error("Logout error:", err);
    res.status(400).json({ status: false, message: err.message });
  }
});

// GET: Authenticated user
router.get('/getAuthUser', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    res.status(200).json(user);
  } catch (err) {
    console.error("Get auth user error:", err);
    res.status(500).json({ status: false, message: "Failed to fetch user" });
  }
});

// GET: Search products by query
router.get("/products/search", async (req, res) => {
  try {
    const query = req.query.query || "";
    
    const results = await Product.find({
      name: { $regex: query, $options: 'i' } // case-insensitive search
    });

    res.status(200).json(results);
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ status: false, message: "Search failed" });
  }
});

// GET: All challenges
router.get('/challenges', async (req, res) => {
  try {
    const challenges = await Challenge.find({ isActive: true });
    res.status(200).json(challenges);
  } catch (error) {
    res.status(500).json({ status: false, message: 'Failed to fetch challenges' });
  }
});

// POST: Join a challenge
router.post('/challenges/join/:challengeId', authenticate, async (req, res) => {
  try {
    const { challengeId } = req.params;
    const user = await User.findById(req.userId);
    if (!user.currentChallenges.includes(challengeId)) {
      user.currentChallenges.push(challengeId);
      await user.save();
    }
    res.status(200).json({ status: true, message: 'Challenge joined', currentChallenges: user.currentChallenges });
  } catch (error) {
    res.status(500).json({ status: false, message: 'Failed to join challenge' });
  }
});

// POST: Complete a challenge
router.post('/challenges/complete/:challengeId', authenticate, async (req, res) => {
  try {
    const { challengeId } = req.params;
    const user = await User.findById(req.userId);
    const challenge = await Challenge.findById(challengeId);
    if (!challenge) return res.status(404).json({ status: false, message: 'Challenge not found' });
    // Remove from currentChallenges
    user.currentChallenges = user.currentChallenges.filter(id => id.toString() !== challengeId);
    // Add badge if not already earned
    const alreadyHasBadge = user.badges.some(b => b.challengeId && b.challengeId.toString() === challengeId);
    if (!alreadyHasBadge) {
      user.badges.push({ ...challenge.rewardBadge.toObject(), challengeId });
    }
    await user.save();
    res.status(200).json({ status: true, message: 'Challenge completed and badge awarded', badges: user.badges });
  } catch (error) {
    res.status(500).json({ status: false, message: 'Failed to complete challenge' });
  }
});

// POST: Update user location
router.post('/api/update-location', authenticate, async (req, res) => {
  try {
    const { location } = req.body;
    const user = await User.findById(req.userId);
    user.location = location;
    await user.save();
    res.status(200).json({ status: true, message: 'Location updated', location });
  } catch (error) {
    res.status(500).json({ status: false, message: 'Failed to update location' });
  }
});

// POST: Direct order (Buy Now)
router.post('/order/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    let product = id.match(/^[0-9a-fA-F]{24}$/)
      ? await Product.findById(id)
      : await Product.findOne({ id: parseInt(id) });

    if (!product) {
      return res.status(404).json({ status: false, message: 'Product not found' });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(400).json({ status: false, message: 'Invalid User' });
    }

    // Create order object
    const orderInfo = {
      productId: product._id,
      name: product.name,
      price: product.price,
      carbonFootprint: product.carbonFootprint,
      ecoScore: product.ecoScore,
      date: new Date(),
    };
    user.orders.push({ orderInfo });
    user.carbonSaved += product.carbonFootprint || 0;
    user.ecoScore += product.ecoScore || 0;
    await user.save();
    res.status(201).json({ status: true, message: 'Order placed successfully', user });
  } catch (error) {
    console.error('Order error:', error);
    res.status(500).json({ status: false, message: 'Failed to place order' });
  }
});

module.exports = router;
