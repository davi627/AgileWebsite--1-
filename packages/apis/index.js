import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { UserRouter } from './Routes/Authentication.js';
import { statisticsRouter } from './Routes/Statistic.js';
import { solutionsRouter } from './Routes/Solution.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { logoRouter } from './Routes/Logo.js';
import { BlogsRouter } from './Routes/Blogs.js';
import { CommentRouter } from './Routes/Comment.js';
import { emailRouter } from './Routes/Email.js';
import bodyParser from 'body-parser';
import { SecurityKey } from './Models/SercurityKey.js';
import './Models/Blogs.js'; 
import { getConfig, updateConfig, getAllConfig } from './configManager.js';
import { solutionCategoriesRouter } from './Routes/SolutionsCategory.js';

const app = express();

// Get the directory name using import.meta.url
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from React's "web/build" folder
app.use(express.static(path.join(__dirname, '../web/build')));
// Middleware
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(
  cors({
    origin: [getConfig('CLIENT_URL')],
    credentials: true,
    optionsSuccessStatus: 200,
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
app.use(bodyParser.json());

// Initialize security key if not present
const initializeSecurityKey = async () => {
  const existingKey = await SecurityKey.findOne();
  if (!existingKey) {
    await SecurityKey.create({ key: '1234' }); 
    console.log('Default security key set.');
  }
};

// Security key routes
app.post('/validate-security-key', async (req, res) => {
  const { key } = req.body;
  try {
    const storedKey = await SecurityKey.findOne();
    if (!storedKey) {
      return res.status(500).json({ error: 'Security key not found' });
    }
    res.json({ isValid: key === storedKey.key });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/update-security-key', async (req, res) => {
  const { newKey } = req.body;
  try {
    const updatedKey = await SecurityKey.findOneAndUpdate(
      {}, 
      { key: newKey }, 
      { new: true, upsert: true }
    );
    res.json({ success: true, updatedKey });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update security key' });
  }
});

// Configuration management routes
app.get('/api/config', (req, res) => {
  res.json(getAllConfig());
});

app.post('/api/config', (req, res) => {
  const { key, value } = req.body;
  if (!key || value === undefined) {
    return res.status(400).json({ error: 'Both key and value are required' });
  }
  
  const success = updateConfig(key, value);
  if (success) {
    res.json({ success: true, message: 'Config updated successfully' });
    
    // Special handling for PORT changes
    if (key === 'PORT') {
      console.log(`PORT changed to ${value}. Please restart the server for changes to take effect.`);
    }
    
    // Special handling for MongoDB URI changes
    if (key === 'MONGO_URI') {
      mongoose.disconnect()
        .then(() => mongoose.connect(value))
        .then(() => console.log('Reconnected to MongoDB with new URI'))
        .catch(err => console.error('Error reconnecting to MongoDB:', err));
    }
  } else {
    res.status(500).json({ error: 'Failed to update config' });
  }
});

// Application routes
app.use('/api', UserRouter);
app.use('/stats', statisticsRouter);
app.use('/solns', solutionsRouter);
app.use('/log', logoRouter);
app.use('/blog', BlogsRouter);
app.use('/comments', CommentRouter);
app.use('/email', emailRouter);
app.use('/api/solution-categories', solutionCategoriesRouter);

// All other requests go to React (for client-side routing)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../web/build', 'index.html'));
});

// Connect to the database
mongoose
  .connect(getConfig('MONGO_URI'))
  .then(() => {
    console.log('Connected to MongoDB');
    initializeSecurityKey();
  })
  .catch((err) => console.error('Mongo connection error:', err));

// Start the server
const port = getConfig('PORT');
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`Client URL: ${getConfig('CLIENT_URL')}`);
});