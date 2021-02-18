const mongoose = require('mongoose');
const {Schema} = mongoose;
const {PASSWORD_HASH_KEY:secret} = process.env;
const crypto = require('crypto');

function hash(password){
    return crypto.createHmac('sha256', secret)
    .update(password)
    .digest('hex');
}

//............................................
const User = new Schema({
    displayName:String,
    email:String,
    social:{
        facebook:{
            id:String,
            accessToken:String
        },
        google:{
            id:String,
            accessToken:String
        }
    },
    password:String,
    createdAt:{
        type:Date,
        default:Date.now
    },
    metalInfo:{
        activated:{type:Boolean,default:false}
    }
});
//............................................
User.statics.findByEmail = function (email) {
    return this.findOne({email}).exec();
}
//............................................
User.statics.findByDisplayName = function (displayName) {
    return this.findOne({displayName}).exec();
}
//............................................
User.statics.findExistancy = function ({displayName,email}) {
    return this.findOne({
        $or:[
            {email},
            {displayName}
        ]
    }).exec();
}
//............................................
User.statics.localRegister = function({displayName,password,email}){
    const user = new this({
        displayName,
        email,
        password:hash(password)
    });
    return user.save();
};
//............................................


module.exports = mongoose.model('User',User);