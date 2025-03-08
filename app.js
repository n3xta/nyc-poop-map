const express = require('express');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const app = express();
const port = process.env.PORT || 3000;

// MapTiler API key
const mapTilerApiKey = 'SDAH1HS7z8VGHOhYwhFv';
app.locals.mapTilerApiKey = mapTilerApiKey;

// Store poop data in memory
let poopData = [];

// Set up EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Set up EJS layouts
app.use(expressLayouts);
app.set('layout', 'layout');

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.render('index');
});

app.get('/submit', (req, res) => {
  res.render('submit', { mapTilerApiKey: app.locals.mapTilerApiKey });
});

app.post('/submit', (req, res) => {
  const { lat, lng, note } = req.body;
  
  if (lat && lng) {
    poopData.push({
      lat: parseFloat(lat),
      lng: parseFloat(lng),
      note: note || "No description provided"
    });
    res.redirect('/map');
  } else {
    res.status(400).send('Latitude and longitude are required');
  }
});

app.get('/map', (req, res) => {
  res.render('map', { 
    poopData: JSON.stringify(poopData),
    mapTilerApiKey: app.locals.mapTilerApiKey
  });
});

app.get('/api/poopdata', (req, res) => {
  res.json(poopData);
});

// Start the server
app.listen(port, () => {
  console.log(`Brooklyn Poop Map app listening at http://localhost:${port}`);
}); 