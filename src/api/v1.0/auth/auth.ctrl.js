const Joi = require('joi');
const User = require('db/models/User');
const token = require('lib/token');

exports.localRegister = async (ctx) =>{
    const { body } = ctx.request;

    const schema = Joi.object({
        displayName: Joi.string().alphanum().min(3).max(30),
        email: Joi.string().email().required(),
        password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{6,30}$'))
    });
    
    const result = schema.validate(body);

    //schema error
    if(result.error){
        ctx.status = 400;
        return;
    }

    const { displayName,email,password} = body;

    try{
        //check email \ displayName existancy
        const exists = await User.findExistancy({
            displayName,
            email
        });

        if(exists){
            ctx.status = 409;
            const key = exists.email === email ? 'email':'displayName';
            ctx.body = {
                key
            };
            return;
        }
        //creates user account
        const user = await User.localRegister({
            displayName,email,password
        })
        ctx.body = user;
        const accessToken = await token.generateToken({
            user:{
                _id:user._id,
                 displayName
            }
        },'user');
        console.log(accessToken);
        //configure accessToken to httpOnly cookies
        ctx.cookies.set('access_token',accessToken,{
            httpOnly:true,
            maxAge:1000*60*60*24*7
        });
    }catch(e){
        ctx.throw(500);
    }

};