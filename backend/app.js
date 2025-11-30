const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const routes = require('./src/routes');
const errorHandler = require('./src/middleware/errorHandler');
const { errorResponse } = require('./src/utils/response');

const app = express();

app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(morgan('dev'));

app.get('/health', (req, res) => {
  res.json({ success: true, message: 'OK' });
});

app.use('/api', routes);

app.use((req, res) => errorResponse(res, 404, 'Route not found'));

app.use(errorHandler);

module.exports = app;
