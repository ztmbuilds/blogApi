const express = require('express');
const morgan = require('morgan');
const authRouter = require('./routes/authRoute');
const postRouter = require('./routes/postRoute');
const blogRouter = require('./routes/blogRoute');
const globalErrorHandler = require('./controllers/errorController');
const AppError = require('./utils/appError');

const app = express();
app.use(express.json());

app.use(morgan('dev'));

app.use('/api/auth', authRouter);
app.use('/api/posts', postRouter);
app.use('/api/blogs', blogRouter);

app.all('*', (req, res, next) => {
  return next(
    new AppError(`Can't find ${req.originalUrl} on this server!`, 404)
  );
});

app.use(globalErrorHandler);

module.exports = app;
