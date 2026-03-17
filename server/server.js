require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const { query } = require('./connection/db'); // import your db.js
const path = require('path');
const OnboardingRoutes = require('./router/onboarding');
const SettingsRoutes = require('./router/settings');

const helmet = require('helmet');

const app = express();

app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(cors({
  origin: ['https://onboarding.bezawcurbside.com', 'http://localhost:3000', 'http://localhost:3002'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.use('/api/onboard', OnboardingRoutes);
app.use('/api/settings', SettingsRoutes);







const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
