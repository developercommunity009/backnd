// controllers/authController.js
const User = require('../model/UserModel');
const jwt = require('jsonwebtoken');

// Middleware to protect routes
exports.protect = async (req, res, next) => {
    let token;
    
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    
    if (!token) {
        return res.status(401).json({ message: 'Not authorized, token failed' });
    }
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.userId).select('-password');
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Not authorized, token failed' });
    }
};

// Signup Controller
exports.signup = async (req, res) => {
    const { firstName, lastName, email, password , role } = req.body;

    try {
        // Check if the user already exists
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create a new user
        const newUser = new User({ firstName, lastName, email, password  ,   role: role || 'user'});
        await newUser.save();

        // Generate a JWT token
        const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

        // Prepare user object without password
        const { password: pwd, ...userWithoutPassword } = newUser.toObject();

        // Send response
        res.status(201).json({ token, user: userWithoutPassword });
    } catch (error) {
        res.status(500).json({ message: 'Error creating user', error });
    }
};

// Login Controller
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find the user by email
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Check if the password matches
        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate a JWT token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

        // Prepare user object without password
        const { password: pwd, ...userWithoutPassword } = user.toObject();

        // Send response
        res.status(200).json({ token, user: userWithoutPassword });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error });
    }
};
