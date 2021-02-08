const Router = require('koa-router');
const auth  = require('./auth');

const v10 = new Router();

v10.use('/auth',auth.routes())

module.exports = v10;