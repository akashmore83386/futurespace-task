const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
mongoose.connect('replace-this-with-mongodb-url', { useNewUrlParser: true, useUnifiedTopology: true });

// Body parser middleware
app.use(bodyParser.json());
app.use(cors());

// Routes
app.use('/signup', require('./routes/signup'));
app.use('/login', require('./routes/login'));
app.use('/password-change', require('./routes/passwordChange'));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));