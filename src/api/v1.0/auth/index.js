const Router = require('koa-router');

const auth = new Router();

auth.get('/',(ctx)=>{
    ctx.body = "HI";
});

module.exports = auth;