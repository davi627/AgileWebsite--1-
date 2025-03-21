import express from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';
import { User } from '../Models/Authentication.js'
const app = express()
const router=express.Router()

router.post('/Register', async (req, res) => {
    try {
        console.log('Received request body:', req.body);

        const { email, password, firstName, lastName, role } = req.body;
        

        // Validate input fields
        if (!email || !password || !firstName || !lastName || !role) {
            console.log('Missing fields:', { email, password, firstName, lastName, role });
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Restrict multiple Admin registrations
        if (role === 'Admin') {
            const adminExists = await User.findOne({ role: 'Admin' });
            if (adminExists) {
                return res.status(400).json({ error: 'An Admin is already registered' });
            }
        }

        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ error: 'Email already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user instance
        const newUser = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            role
        });

        console.log('Saving new user:', newUser);

        // Save user to database
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });

    } catch (error) {
        console.error('Error in /Register route:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



//Login route

router.post('/login', async (req, res) => {
    const { email, password, role='Admin' } = req.body;
    console.log('Role sent in request:', role);

    if (!email || !password || !role) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        const user = await User.findOne({ email, role });
        console.log('User found:', user);
        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
           
        }
        console.log('Role in database:', user.role);

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const token = jwt.sign({ _id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.cookie('token', token, { httpOnly: true, maxAge: 3600000 }).json({ message: 'Logged in successfully',role: user.role, token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server Error' });
    }
});



export  {router as UserRouter}