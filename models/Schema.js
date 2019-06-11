var mongoose = require('./db');

// 创建模型
var schema = mongoose.Schema;
var UserSchema = new schema({
    username:{type:String,unique:true,required:true},
    password:{type:String,required:true},
    phone:{type:Number,required:true}
});

module.exports = mongoose.model("user",UserSchema);