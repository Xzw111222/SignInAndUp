var user = require('./Schema');


// 添加
function insert(){
    var user1 = new user({
        username:"Tracy McGrady",
        password:"123",
        phone:"9090980"
    });
    user1.save(function(err, res){
        if(!err){
            console.log(res);
        }else {
            console.log(err);
        }
    });
}

// 更新
function update() {
    var whereStr = {username:"Tracy McGrady"};
    var updateStr = {password:"111"};

    user.updateOne(whereStr,updateStr,function (err, res) {
        if(!err){
            console.log(res);
        }else {
            console.log(err);
        }
    })
}

// 删除
function del(){
    var whereStr = {username:"Tracy McGrady"};
    user.remove(whereStr,function(err,res){
        if(!err){
            console.log(res);
        }else {
            console.log(err);
        }
    });
}

// 查询
function find() {
    var whereStr = {username:"Tracy McGrady"};
    var opt = {"username": 1 ,"_id": 0};
    user.findOne(whereStr,opt,function (err, res) {
        if(!err){
            console.log(res);
        }else {
            console.log(err);
        }
    });
}
find();