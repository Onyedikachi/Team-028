import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import path from 'path';
import helmet from 'helmet';
import morgan from 'morgan';
import session from 'express-session';
import expressip from 'express-ip';
import * as cookieParser from 'cookie-parser';
import logger from './config/logger';
import apiRoutes from './router';

import config from './config';


const port = process.env.PORT || config.port;

const app = express();

// determine user ip
app.use(expressip().getIpInfoMiddleware);

// use session
app.use(session({
  secret: config.jwtsecret,
  resave: false,
  saveUninitialized: true
}));

// logging
app.use(morgan(':method\t\t:url\t\t:status\t\t:response-time', {
  stream: logger.stream
}));

// to enhance security
app.use(helmet());
app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: '52428800' }));

app.use(cookieParser.default());

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.resolve(__dirname, '../../dist')));
  app.get('/*', (req, res) => {
    res.sendFile(path.resolve('index.html'));
  });
}

app.use('/api/v1', apiRoutes);
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  if (err.isBoom) {
    const { message } = err.data[0];
    res.status(err.output.statusCode).json({
      status: 'error',
      message
    });
  } else if (err.status === 404) {
    res.status(404).json({
      status: 'error',
      message: 'Not Found'
    });
  } else {
    res.status(500).json({
      status: 'error',
      message: err.message || 'Something Went Wrong'
    });
  }
});
app.listen(port, logger.info(`Server listening on port ${port}`));
