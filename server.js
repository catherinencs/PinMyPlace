const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const app = express();
const port = 8083;

// Connect to MongoDB
mongoose.connect('mongodb://localhost/userLocationDB', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// Define a schema for the location data
const locationSchema = new mongoose.Schema({
  name: String,
  phone: String,
  latitude: Number,
  longitude: Number
});

// Create a model based on the schema
const Location = mongoose.model('Location', locationSchema);

// Middleware to parse JSON bodies
app.use(express.json());

// Define the POST route for submitting location data
app.post('/api/submit-location', async (req, res) => {
  const data = req.body;

  const newLocation = new Location({
    name: data.name,
    phone: data.phone,
    latitude: data.latitude,
    longitude: data.longitude
  });

  try {
    await newLocation.save();

    // Prepare the message for Slack
    const message = {
      text: `New location shared by ${data.name}: Latitude ${data.latitude}, Longitude ${data.longitude}, Phone: ${data.phone}`,
    };

    // Send message to Slack via Webhook
    await axios.post('https://hooks.slack.com/services/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', message);

    res.json({ message: 'Location data saved and sent to Slack successfully!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error saving data or sending message to Slack' });
  }
});

// Define the GET route for fetching location data
app.get('/api/users', async (req, res) => {
  try {
    const users = await Location.find(); // Using the Location model to fetch data
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
