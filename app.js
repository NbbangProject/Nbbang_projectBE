const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();
const connect = require('./schemas');
app.use(
  cors({
    exposedHeaders: ['authorization'],
    origin: '*',
    credentials: 'true',
  })
);
connect();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use('/api', require('./routes/comment.js'));
app.use('/api', require('./routes/post.js'));
app.use('/api', require('./routes/user.js'));
app.use(express.static('uploads'));

app.use((req, res, next) => {
  console.log('Request URL:', req.originalUrl, ' - ', new Date());
  next();
});

app.listen(process.env.PORT, () => {
  console.log(`listening on 5000`);
});
