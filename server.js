const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();
const port = 8083;

// Connect to MongoDB database
mongoose.connect('mongodb://localhost/userLocationDB', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected')) // Log success message
  .catch(err => console.log(err)); // Log error on connection failure

// Define a schema for storing location data
const locationSchema = new mongoose.Schema({
  name: String,
  phone: String,
  latitude: Number,
  longitude: Number
});

// Create a model from the schema for the Location collection
const Location = mongoose.model('Location', locationSchema);

// Middleware to parse JSON bodies in requests
app.use(express.json());

// POST route to handle submission of new location data
app.post('/api/submit-location', async (req, res) => {
  const data = req.body;

  // Create a new location instance with the received data
  const newLocation = new Location({
    name: data.name,
    phone: data.phone,
    latitude: data.latitude,
    longitude: data.longitude
  });

  try {
    // Save the new location to the database
    await newLocation.save();
    
    // Send success response to the client
    res.json({ message: 'Location data saved successfully!' });
  } catch (err) {
    // Handle and log errors during saving
    console.error(err);
    res.status(500).json({ message: 'Error saving data' });
  }
});

// GET route to fetch all stored location data
app.get('/api/locations', async (req, res) => {
  try {
    // Retrieve all locations from the database
    const locations = await Location.find();
    // Send locations in response
    res.json(locations);
  } catch (error) {
    // Handle and log errors during fetching
    console.error(error);
    res.status(500).json({ message: 'Error fetching location data' });
  }
});

// Serve static files (e.g., Vue app build files)
app.use(express.static(path.join(__dirname, '/dist')));

// Fallback route handler for all other requests
app.get('*', (req, res) => {
  // Serve the index.html file for non-API requests
  res.sendFile(path.join(__dirname, '/dist/index.html'));
});

// Start the server on the specified port
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
