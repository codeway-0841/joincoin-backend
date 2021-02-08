const mongoose =require('mongoose');

const {MONGO_URI:mongoURI} = process.env;

module.exports = (function () {
    
    mongoose.Promise = global.Promise;

    return{
        connect(){
            mongoose.connect(mongoURI,{
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useCreateIndex:true,
                useFindAndModify:false
            }).then(()=>{
                console.log("connected to database");
            }).catch((err) =>{
                console.log("not connected to database ERROR!",err);
            });
        }
    }
})();