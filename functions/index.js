const functions = require("firebase-functions");
const express = require('express');
const app = express();
const cors = require('cors');

// Use middlewares
app.use(cors());
app.use(express.json());

// Routes
const routes = require('./routes/routes');
app.use(routes);

app.get('/', (req, res) => {
    console.log('App is running...')
    res.send({ message: 'Test: This works...' })
})

exports.api = functions.https.onRequest(app);