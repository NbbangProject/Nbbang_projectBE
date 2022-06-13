const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;
const connect = require('./schemas');

connect();
app.use(express.json());
app.use('/api', require('./routes/comment.js'));
app.use('/api', require('./routes/post.js'));
app.use('/api', require('./routes/user.js'));

app.use(cors());
app.use((req, res, next) => {
  console.log('Request URL:', req.originalUrl, ' - ', new Date());
  next();
});

app.listen(port, () => {
  console.log(`listening on ${port}`);
});
