const express = require('express');
const cookieparser = require('cookie-parser');
const cors = require('cors');
const path = require('path');
const app = express();
const PORT = process.env.APP_PORT || 4000;
const mongoose = require('mongoose');
const mongoConnect = require('./config/mongo');
const verifyJWT = require('./middleware/verifyJWT');
const { logError } = require('./controllers/logHandler');
const handleErrors = require('./middleware/handleErrors');

require('dotenv').config();

mongoConnect();

app.use(cookieparser());
app.use(express.json());
app.use(
  cors({
    credentials: true,
    origin: 'https://auth-testing-ten.vercel.app',
  })
);
app.use(express.urlencoded({ extended: false }));
app.use('/', express.static(path.join(__dirname, '/public')));
app.use('/register', require('./routes/register'));
app.use('/login', require('./routes/login'));
app.use('/logout', require('./routes/logout'));
app.use('/logs/', require('./routes/logs'));
app.use('/product', require('./routes/product'));
app.get('/', verifyJWT, (req, res) => {
  res.status(200).json({ message: 'cleared jwt', user: req.user });
});
app.use(handleErrors);

mongoose.connection.once('open', () => {
  console.log('Connected to Mongo DB');
  app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
});
