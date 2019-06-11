var mongoose = require('./CodeDB');

// 创建模型
var schema = mongoose.Schema;
var CodeSchema = new schema({
    code:{type:Number,required:true}
});

module.exports = mongoose.model("code",CodeSchema);