// Libraries
const router = require('express').Router();
const Product = require('../models/Product');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const authenticate = require('../middleware/authenticate');
const { check, validationResult } = require('express-validator');

// Get products API
router.get("/products", async function(req, res) {
  try {
    // Fetching data from database
    const productsData = await Product.find();
    res.status(200).json(productsData);
  } catch (error) {
    console.log(error);
  }
})

// Get individual data
router.get("/product/:id", async function(req, res) {
  try {
    const {id} = req.params;
    let individualData;
    
    // Try to find by MongoDB _id first
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      individualData = await Product.findById(id);
    }
    
    // If not found by _id, try to find by custom id
    if (!individualData) {
      individualData = await Product.findOne({ id: parseInt(id) });
    }

    if (!individualData) {
      return res.status(404).json({
        status: false,
        message: "Product not found"
      });
    }

    res.status(200).json(individualData);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: false,
      message: "Error fetching product",
      error: error.message
    });
  }
})

// Post register data
router.post('/register', [
    // Check Validation of Fields
    check('name').not().isEmpty().withMessage("Name can't be empty")
                      .trim().escape(),

    check('number').not().isEmpty().withMessage("Number can't be empty")
                      .isNumeric().withMessage("Number must only consist of digits")
                      .isLength({max: 10, min: 10}).withMessage('Number must consist of 10 digits'),

    check('password').not().isEmpty().withMessage("Password can't be empty")
                      .isLength({min: 6}).withMessage("Password must be at least 6 characters long")
                      .matches(/\d/).withMessage("Password must contain a number")
                      .isAlphanumeric().withMessage("Password can only contain alphabets and numbers"),

    check('confirmPassword').not().isEmpty().withMessage("Confirm Password can't be empty"),

    check('email').not().isEmpty().withMessage("Email can't be empty")
                      .isEmail().withMessage("Email format is invalid")
                      .normalizeEmail()

  ], async function(req, res) {
    try {
      const validationErrors = validationResult(req);

      if (!validationErrors.isEmpty()) {
        return res.status(400).json({
          "status": false,
          "message": validationErrors.array()
        });
      }

      const { name, number, email, password, confirmPassword } = req.body;
      const customErrors = [];

      // Check Duplicate Emails
      const duplicateEmail = await User.findOne({ email: email });
      if (duplicateEmail) {
        customErrors.push({msg: "Email already registered"});
        return res.status(400).json({
          "status": false,
          "message": customErrors
        });
      }

      // Check Duplicate Numbers
      const duplicateNumber = await User.findOne({ number: number });
      if (duplicateNumber) {
        customErrors.push({msg: "Number already registered"});
        return res.status(400).json({
          "status": false,
          "message": customErrors
        });
      }

      // Check if Passwords Match
      if (password !== confirmPassword) {
        customErrors.push({msg: "Passwords don't match"});
        return res.status(400).json({
          "status": false,
          "message": customErrors
        });
      }

      // Hashing the password
      const saltRounds = 10;
      const salt = await bcrypt.genSalt(saltRounds);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = new User({
        name: name,
        number: number,
        email: email,
        password: hashedPassword
      });

      const savedUser = await newUser.save();
      res.status(201).json(savedUser);

    } catch (error) {
      console.log(error);
      res.status(500).json({
        "status": false,
        "message": "Internal server error"
      });
    }
});

// Post registered data / login 
router.post('/login', [
    // Check fields validation
    check('email').not().isEmpty().withMessage("Email can't be empty")
                    .isEmail().withMessage("Email format invalid")
                    .normalizeEmail(),
    
    check('password').not().isEmpty().withMessage("Password can't be empty")
                    .isLength({min: 6}).withMessage("Password must be at least 6 characters long")
                    .matches(/\d/).withMessage("Password must contain a number")
                    .isAlphanumeric().withMessage("Password can only contain alphabets and numbers")

  ], async function(req, res) {
    try {
      console.log('Login attempt for email:', req.body.email);
      
      const validationErrors = validationResult(req);
      if (!validationErrors.isEmpty()) {
        console.log('Validation errors:', validationErrors.array());
        return res.status(400).json({
          "status": false,
          "message": validationErrors.array()
        });
      }

      const { email, password } = req.body;
      const customErrors = [];

      // Check if email exists
      const found = await User.findOne({ email: email });
      console.log('User found:', !!found);
      
      if (!found) {
        customErrors.push({msg: "Incorrect Email or Password"});
        return res.status(400).json({
          "status": false,
          "message": customErrors
        });
      }

      // Comparing the password
      const isMatch = await bcrypt.compare(password, found.password);
      console.log('Password match:', isMatch);
      
      if (isMatch) {
        try {
          // Token generation
          console.log('Attempting to generate token...');
          const token = await found.generateAuthToken();
          console.log('Token generated:', !!token);
          
          if (!token) {
            throw new Error('Token generation failed');
          }

          // Cookie generation
          res.cookie("AmazonClone", token, {
            expires: new Date(Date.now() + 3600000), // 60 Mins
            httpOnly: true
          });
          console.log('Cookie set successfully');

          return res.status(201).json({
            "status": true,
            "message": "Logged in successfully!"
          });
        } catch (tokenError) {
          console.log('Token generation error:', tokenError);
          return res.status(500).json({
            "status": false,
            "message": "Authentication failed"
          });
        }
      } else {
        customErrors.push({msg: "Incorrect Email or Password"});
        return res.status(400).json({
          "status": false,
          "message": customErrors
        });
      }

    } catch (error) {
      console.log('Login error:', error);
      res.status(500).json({
        "status": false,
        "message": "Internal server error"
      });
    }
});

// Adding items to cart
router.post('/addtocart/:id', authenticate, async function(req, res) {
  try {
    const {id} = req.params; // Getting id from url parameters 
    let productInfo;
    
    // Try to find by MongoDB _id first
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      productInfo = await Product.findById(id);
    }
    
    // If not found by _id, try to find by custom id
    if (!productInfo) {
      productInfo = await Product.findOne({ id: parseInt(id) });
    }

    if (!productInfo) {
      return res.status(404).json({
        status: false,
        message: "Product not found"
      });
    }

    const userInfo = await User.findOne({ _id: req.userId }); // req.UserId from authenticate.js

    if (!userInfo) {
      return res.status(400).json({
        status: false,
        message: "Invalid User"
      });
    }

    let flag = true;

    for (let i = 0; i < userInfo.cart.length; i++) {
      // Incrementing qty by one if product already exists in cart
      if (userInfo.cart[i].id == productInfo.id) {
        const test = await User.updateOne(
          { _id: req.userId, 'cart.id': productInfo.id }, 
          { $inc: { 'cart.$.qty': 1 } }
        );
        console.log(test);
        flag = false;
        break;
      }
    }

    if (flag) { // flag = true means the product is not in the cart
      await userInfo.addToCart(productInfo.id, productInfo); // Adding new product into cart
    }

    // Get updated user info
    const updatedUser = await User.findOne({ _id: req.userId });
    
    res.status(201).json({
      status: true,
      message: updatedUser
    });

  } catch (error) {
    console.log('Add to cart error:', error);
    res.status(500).json({
      status: false,
      message: "Error adding item to cart",
      error: error.message
    });
  }
});

// Delete items from cart
router.delete("/delete/:id", authenticate, async function(req, res) {
  try {
    const {id} = req.params;
    const userData = await User.findOne({ _id: req.userId });

    userData.cart = userData.cart.filter(function(cartItem) {
      return cartItem.id != id;
    })

    await userData.save();

    res.status(201).json({
      status: true,
      message: "Item deleted successfully"
    })

    console.log(userData);

  } catch (error) {
    res.status(400).json({
      status: false,
      message: error
    })
  }
})

// Logout 
router.get("/logout", authenticate, async function(req, res) {
  try {

    // Deleting current token on logout from database
    req.rootUser.tokens = req.rootUser.tokens.filter(function(currentToken) {
      return currentToken.token !== req.token
    })

    // Cookie expiration
    await res.cookie("AmazonClone", {
      expires: Date.now()
    });

    req.rootUser.save();

    return res.status(201).json({
      "status": true,
      "message": "Logged out successfully!"
    })
  } catch (error) {
    res.status(400).json({
      "status": false,
      "message": error
    })
  }
})

// Verify if user is logged in
router.get('/getAuthUser', authenticate, async function(req, res) {
  const userData = await User.findOne({ _id: req.userId });
  res.send(userData);
});

module.exports = router;