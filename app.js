const express = require('express');
const cors = require('cors');
const app = express();
const port = 5000;
const connect = require('./schemas');

connect();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use('/api', require('./routes/comment.js'));
app.use('/api', require('./routes/post.js'));
app.use('/api', require('./routes/user.js'));
app.use(express.static('uploads'));

app.use(cors());
app.use((req, res, next) => {
  console.log('Request URL:', req.originalUrl, ' - ', new Date());
  next();
});

app.listen(port, () => {
  console.log(`listening on ${port}`);
});
