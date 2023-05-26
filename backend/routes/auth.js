const express = require("express");
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require("../models/User");
const fetchUser = require("../middleware/fetchUser");
const { body, validationResult } = require('express-validator');

const JWT_SECRET = "ThereIsNoSecret";

// Route1 Creating user no login required
router.post("/createuser",[

    // express validator
    body('email', "Enter a valid email").isEmail(),
    body('name', "Name must be atleast 3 characters.").isLength({ min: 3 }),
    body('password', "Password must be atleast 5 characters.").isLength({ min: 5 })
],async  (req,res)=>{

    let success = false;
    // if validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({success, errors: errors.array() });
    }
    try{
        // unique email check
        let user = await User.findOne({email: req.body.email});
        if (user){
            return res.status(400).json({success, error: "User with this email already exists."})
        }

        // create users
        const salt = await bcrypt.genSalt(10);
        const secPassWord = await bcrypt.hash(req.body.password, salt);
        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: secPassWord,
        })

        // json web token
        const data = {user: { id: user.id}};
        const authToken = jwt.sign(data, JWT_SECRET);
        success = true;
        res.json({success, authToken});

    } catch(error){
        console.error(error.message);
        res.status(500).send("Internal server error");
    }
})
// Route2 Login no login required
router.post("/login",[

    // express validator
    body('email', "Enter a valid email").isEmail(),
    body('password', "Password can not be blank").exists(),
],async  (req,res)=>{

    let success = false;
    // if validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
       return res.status(400).json({success, errors: errors.array() });
    }

    const {email, password} = req.body;
    try {
        let user = await User.findOne({email});
        if(!user){
            return res.status(400).json({ success, error: "Please enter correct credentials."});
        }

        const passwordCompare = await bcrypt.compare(password, user.password);
        if(!passwordCompare){
            return res.status(400).json({success, error: "Please enter correct credentials."});
        }

        const data = {user: { id: user.id}};
        const authToken = jwt.sign(data, JWT_SECRET)
        success = true;
        res.json({success, authToken});
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error");
    }

})

// Route 3 User details login required
router.post("/getUser",fetchUser ,async  (req,res)=>{

    try {
        userId = req.user.id;
        const user = await User.findById(userId).select("-password");
        res.send(user);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error");
    }

})

module.exports = router;