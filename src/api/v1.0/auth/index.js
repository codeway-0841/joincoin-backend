const Router = require('koa-router');
const authCtlr = require('./auth.ctrl');

const auth = new Router();

auth.get('/',(ctx)=>{
    ctx.body = "HI";
});

auth.post('/register/local',authCtlr.localRegister);
auth.post('/login/local',authCtlr.localLogin);

module.exports = auth;