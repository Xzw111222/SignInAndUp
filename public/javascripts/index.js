
$(function () {
    $(".btn_sign_up").click(function () {
        // 动画
        $(".sign-up_panel").fadeOut(2300); // 欢迎注册移到最右边
        $(".sign-up").delay(500).animate({top:"100%",right:0},0).animate({top:0,right:0},2000); // 注册界面移到中间右边
        $(".sign-in").fadeOut(2300); // 登录界面移到最左边
        $(".sign-in_panel").delay(500).animate({top:"-100%",left:0},0).animate({top:0,left:0},2000); // 欢迎登录界面移到中间左边
    });

    $(".btn_sign_in").click(function () {
        $(".sign-up_panel").delay(2000).fadeIn(1000,"linear"); // 欢迎注册出现
        $(".sign-up").delay(500).animate({right:"-380px"},2100); // 注册界面移到最右边
        $(".sign-in").delay(2000).fadeIn(1000,"linear"); // 登录界面出现
        $(".sign-in_panel").delay(500).animate({left:"-380px"},1600); // 欢迎登录界面移到最左边
    });

    var flag = true;

    // 生成六位随机验证码
    function numRandom(){
        var num = "";
        for (var i = 0; i < 6; i++) {
            num += Math.floor(Math.random()*10);
        }
        return num
    }
    var xxx = numRandom();

    // 1. 注册
    $(".register-signUp").click(function () {
        $.ajax({
            type:"post",
            url:"/register",
            dataType:'json',
            data:{
                username:$(".register-name").val(),
                password:$(".register-pwd").val(),
                phone:$(".register-tel").val(),
                code:$(".register-Code").val()
            },
            success:function (res) {
                    console.log(res.message);
                    console.log(res.code);
                    if(res.code === 1 || res.code === 2 || res.code === 3 || res.code === 4 || res.code === 5|| res.code === 7 ||  res.code === 8){
                        $(".msg").css({"background-color":"#fc4365"});
                    }
                    if(res.code === 6){
                        $(".btn_sign_in").triggerHandler("click");
                    }

                    $(".msg").html(res.message).slideDown(666).delay(4500).fadeOut(200);
            },
            error:function (err) {
                console.log(err.status);
                if (err.status === 404) {
                    window.location.href = "404"
                }
            }
        });
        return false;
    });

    // 2. 登录
    $(".btn-SignIn").click(function () {
        $.ajax({
            url:"/login",
            type:"post",
            dataType:"json",
            data:{
                NameOrPhone:$(".loginName").val(),
                password:$(".loginPwd").val()
            },
            success:function (res) {
                console.log(res.code, res.message);
                if (res.code === 33) {
                    window.location.href = "success";
                }
                $(".msg").html(res.message).slideDown(666).delay(4500).fadeOut(200);
            }
        })
    });

    // 3. 发送短信
    $(".register-getCode").click(function () {


        var MsgID = 157681;
        var AppKey = "340fb4b082cf179a9e0c303244125429";
        var verifyCode = "%23code%23%3d"+ xxx;
        var phone = $(".register-tel").val();
        if (phone === "") {
            flag = false;
            $(".msg").html("输入手机号啊！").slideDown(666).delay(4500).fadeOut(200);
        }else {
            flag = true;
            // 点击之后，变为60s倒计时。
            var count = 120;
            $(this).attr("disabled",true);

            var timer = setInterval(function () {
                count -= 1;
                $(".register-getCode").text("请等待 "+count+"s");
                if (count === 0) {
                    clearInterval(timer);
                    $(".register-getCode").attr("disabled",false);
                    $(".register-getCode").text("重新发送");
                }
            },1000);

            $.ajax({
                url:"http://v.juhe.cn/sms/send",
                type:"get",
                dataType:"jsonp",
                data:{
                    tpl_id:MsgID,
                    tpl_value:verifyCode,
                    key:AppKey,
                    mobile:phone
                },
                success:function (data) {
                    console.log(data);
                }
            });
        }
        console.log(flag);

        if (flag === true) {
            $(".hideBtn").triggerHandler("click");
        }
    });


    //4. 传递验证码到后台
        $(".hideBtn").click(function () {
            console.log(xxx);
            $.ajax({
                url:"/sentCode",
                dataType:"json",
                type:"get",
                data:{
                    verifyCode:xxx
                },
                success:function (data) {
                    console.log(data);
                    console.log("OK!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
                },
                error:function (err) {
                    console.log("失败");
                }
            })
        })
});
