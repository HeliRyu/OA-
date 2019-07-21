//登录注册
$(function(){
});

//勾选框选中后，使用cookie加密保存登录成功后的用户名、密码。再次打开登录页，直接从cookie中解密。
// （如果一周内免登陆复选框在提交数据时有选中，则跳转前将用户信息存入Cookie，下一次打开登陆页的时候不需要提交用户名密码直接到成功页面。）
//登录和记住密码，发送用户名和密码到后台进行验证
function login(){
    var laccount=$("#login_uaccount").val();
    var lpassword=$("#login_upassword").val();
    var lremember=$("#login_remember").val();
$.ajax({
    url:"/portal/login.do",//请求地址
    type:'post',//请求方式
    data:{//提交参数
        laccount:laccount,
        lpassword:lpassword
    },
    dataType:"json",//返回结构类型
    success:function (json) {
        $("#result").html(json.msg);
        if(json.success){
            $("#result").css("color","green");
            window.location.href="/view/login/main.html"//成功则跳转到登录成功的页面
        }else{
            $("#result").css("color","red");
        }
    },
    error:function () {
        alert("请求失败");
    }
})
}

//点击忘记密码按钮，弹出框中输入要重置的账号名和email，发送随机密码给到用户邮箱，并覆盖数据库中的旧密码
//忘记重置密码，取消此功能
function resetPwd(){
    var raccount=$("#reset_account").val();
    var remail=$("#reset_email").val();
    $.ajax({
        url:"/portal/resetPwd.do",//请求地址
        type:'post',//请求方式
        data:{//提交参数
            raccount:raccount,
            remail:remail
        },
        dataType:"json",//返回结构类型
        success:function (json) {
            $("#resetPwd_result").html(json.msg);
            if(json.success){
                $("#result").css("color","green");

            }else{
                $("#result").css("color","red");
            }
        },
        error:function () {
            alert("请求失败");
        }
    })
}

//注册新增
//所有字段都必填。新增字段，用户头像，考察对文件上传，file类的操作
function register_save() {
    $("#register_save").attr("disabled",true);//设置不可重复点击注册按钮
    var saccount=$("#register_account").val();
    var sname=$("#register_name").val();
    var sbirthday=$("#register_birthday").val();
    var spassword=$("#register_password").val();
    var sppassword=$("#confirm_password").val();
    var semail=$("#register_email").val();
    var sremark=$("#register_remark").val();
    if(!saccount){
        alert("账号不可为空");
        $("#register_save").attr("disabled",false);//解除禁止点击注册按钮
        return;
    }
    if(!sname){
        alert("姓名不可为空");
        $("#register_save").attr("disabled",false);
        return;
    }
    if(!sbirthday){
        alert("生日不可为空");
        $("#register_save").attr("disabled",false);
        return;
    }
    if(!spassword){
        alert("密码不可为空");
        $("#register_save").attr("disabled",false);
        return;
    }
    if(!sppassword){
        alert("确认密码不可为空");
        $("#register_save").attr("disabled",false);
        return;
    }
    if(sppassword!=sppassword){
        alert("确认密码失败");
        return;
    }
    if(!semail){
        alert("邮件不可为空");
        $("#register_save").attr("disabled",false);
        return;
    }
    if(!sremark){
        alert("备注不可为空");
        $("#register_save").attr("disabled",false);
        return;
    }
    if(!$("#register_img")[0].files[0]){
        alert("头像不可为空");
        $("#register_save").attr("disabled",false);
        return;
    }
    var f=new FormData();
    f.append("img",$("#register_img")[0].files[0]);
    f.append("laccount",saccount);
    f.append("lname",sname);
    f.append("lbirthday",sbirthday);
    f.append("lpassword",spassword);
    f.append("lemail",semail);
    f.append("lremark",sremark);
    $.ajax({
        url:"/portal/register.do",
        type:"post",
        data:f,
        /**
         *必须false才会自动加上正确的Content-Type
         */
        contentType: false,
        /**
         * 必须false才会避开jQuery对 formdata 的默认处理
         * XMLHttpRequest会对 formdata 进行正确的处理
         */
        processData: false,
        dataType:'json',
        success:function (json) {
            $("#register_save").attr("disabled",false);
            $('#register').modal('hide');//关闭弹窗
            alert(json.msg);
        },
        error:function(){
            alert("服务器异常");
            $("#register_save").attr("disabled",false);
        }
    })
    // 模态框关闭事件
    $('register').on('hidden.bs.modal',function (e) {
        $("#register_account").val("");
        $("#register_name").val("");
        $("#register_birthday").val("");
        $("#register_password").val("");
        $("#confirm_password").val("");
        $("#register_email").val("");
        $("#register_remark").val("");
        $("#register_img").val("");
    })
}