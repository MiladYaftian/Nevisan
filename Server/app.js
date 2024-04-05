const express = require('express');
require('express-async-errors');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const groupRoutes = require('./routes/group');
const postRoutes = require('./routes/post');
const userRoutes = require('./routes/user');

const app = express();

app.use(cors());
app.use(express.json({limit: '10mb'}));
app.use(express.urlencoded({limit: '10mb', extended: true}));

app.use('/api', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/users', userRoutes);

module.exports = app;
