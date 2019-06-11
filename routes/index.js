var express = require('express');
var router = express.Router();

var body_parser = require('body-parser');
router.use(body_parser.json());
router.use(body_parser.urlencoded({extended:true}));

// 引入bcrypt.js  对密码进行加密
var bcrypt = require("bcryptjs");

// 引入cookie和session todo
var cookieParser  = require('cookie-parser');
var session = require('express-session');
router.use(cookieParser("signMyCookie"));
// router.use(session({}));

// 数据库模块
var code = require("../models/CodeSchema"); // 验证码数据库

// 返回统一格式
var resData;
router.use(function (req, res, next) {
  resData = {
    code:0,
    message:""
  };
  next();
});
function del(){
  var whereStr = {code:""};
  code.deleteOne(whereStr,function(err,res){
    if(!err){
      console.log(res);
    }else {
      console.log(err);
    }
  });
}
function find(Code) {
  var whereStr = {code:Code};
  var opt = {"_id": 0,"__v":0};
  code.findOne(whereStr,opt,function (err, res) {
    if(!err){
      console.log(res);
    }else {
      console.log(err);
    }
  });
  return Code;
}

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* 验证码逻辑
1. 从输入框获取用户输入的验证码，利用ajax发送到后台。 /register
2. 把真实的验证码从前台传到后台，在后台先存放到数据库,然后从数据库查找
3. 进行比对.
*/
router.get("/sentCode",function (req, res, next) {
  global.verifyCode = req.query.verifyCode;// 拿验证码
  console.log("从前台拿来的验证码是："+verifyCode);
  code.create({
    code:verifyCode
  });
  global.x = find(global.verifyCode);
  console.log(x);
  // del();
});

router.get('/success',function (req, res, next) {
  res.render('success',{title:"success"});
});

// 重置密码
router.get('/resetPwd',function (req, res, next) {
  res.render("resetPwd",{title:"重置密码"})
});

// 注册
var user = require("../models/Schema");  // 用户个人信息数据库
router.post('/register',function (req, res, next) {
  var name = req.body.username;
  var pwd = req.body.password;
  var phone = req.body.phone;
  var verifyCode = req.body.code;

  // 密码加密
  var salt = bcrypt.genSaltSync(10); // 加密等级
  var hash = bcrypt.hashSync(pwd,salt);

  if(name === ""){
    resData.code = 1;
    resData.message = "用户名为空";
    res.json(resData);
    return;
  }

  if(pwd === ""){
    resData.code = 2;
    resData.message = "密码为空";
    res.json(resData);
    return;
  }

  if(phone === ""){
    resData.code = 3;
    resData.message = "手机号为空";
    res.json(resData);
    return;
  }
  if (verifyCode === ""){
    resData.code = 7;
    resData.message = "验证码为空";
    res.json(resData);
    return;
  }
  if (verifyCode !== global.x){
    resData.code = 8;
    resData.message = "验证码错误";
    res.json(resData);
    return;
  }

  user.findOne({username:name},function (err, data) {
    if(err){
      resData.code = 4;
      resData.message = "Something Goes Wrong!";
      res.json(resData);
      return;
    }else if(data){
      resData.code = 5;
      resData.message = "该用户已被注册!";
      res.json(resData);
      return ;
    }else {
      user.create({
        username:name,
        password:hash,
        phone:phone
      },function (err, data) {
        if(err){
          console.log(err);
        }else {
          resData.code = 6;
          resData.message = "用户创建成功!";
          res.json(resData);
        }
      });
    }
  })
});

// 登录
router.post('/login',function (req, res, next){
  var nameorphone = req.body.NameOrPhone;
  var pwd = req.body.password;
  console.log(nameorphone,pwd);

  if(nameorphone === "" || pwd === ""){
    resData.code = 11;
    resData.message = "用户名或密码不能为空!";
    res.json(resData);
    return;
  }

  /*
    密码加密验证逻辑
    1. 拿到用户输入的密码
    2. 与数据库里已经加密的密码进行对比 bcrypt.compare("B4c0/\/", hash, function(err, res) {}
  */
  user.findOne({username:nameorphone},{"_id":0,"__v":0,"phone":0},function (err, data) {
    if (!data) {
      resData.code = 55;
      resData.message = "用户未注册!";
      res.json(resData);
      return;
    }
    if (err) {
      console.log(err);

    } else {
      var comparedPwd = data.password;  // 拿到数据库中已加密的密码
      console.log(comparedPwd);

      var pwdMatchFlag = bcrypt.compareSync(pwd,comparedPwd) ; // pwdMatchFlag的值为true或false
      if (pwdMatchFlag) {
        // 匹配成功
        console.log("密码匹配成功");

        // 查询数据库中是否存在
        user.findOne({
          username:nameorphone,
          password:comparedPwd
        },function (err, data) {
          if (!data) {
            resData.code = 22;
            resData.message = "用户不存在,请注册!";
            res.json(resData);
            return;
          }else {
            resData.code = 33;
            resData.message = "登录成功!";
            res.json(resData);
          }
        });
      } else {
        // 匹配失败
        resData.code = 44;
        resData.message = "密码错误!";
        res.json(resData);
        console.log("密码匹配失败");
        return;
      }
    }
  });
});

// 注销 todo
router.post('/logout',function (req, res, next) {
  res.redirect('/')
});

// 重置密码
router.post('/resetPwd',function (req, res, next) {
  var name = req.body.username;
  var pwd = req.body.password;
  var rePwd = req.body.RePassword;
  console.log(name, pwd, rePwd);

  var salt = bcrypt.genSaltSync(10); // 加密等级
  var hash = bcrypt.hashSync(pwd,salt);

  var wherestr = {username:name};
  var upDateStr = {password:hash};
  user.updateOne(wherestr,upDateStr,function (err, data) {
    if (!err) {
      console.log(data);
    }else {
      console.log("修改失败");
    }
  })
});

module.exports = router;