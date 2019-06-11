 // 连接数据库
var mongoose = require('mongoose');
mongoose.connect("mongodb://localhost:27017/users",{ useNewUrlParser: true ,useCreateIndex:true});
// // 监听状态
var db = mongoose.connection;
db.on("error", function(){
  console.log("数据库连接失败");
});

db.once("open", function () {
  console.log("恭喜你，连接到user数据库!");
});
// 断开
db.once("close",function(){
  console.log("数据库断开成功!");
});

module.exports = mongoose;