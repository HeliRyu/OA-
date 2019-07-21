package com.bypx.controller;
import com.bypx.page.LoginPage;
import com.bypx.service.LoginService;
import com.bypx.service.RegisterService;
import com.bypx.service.ResetPwdService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

//登录注册
@Controller
@RequestMapping("/portal")
public class LoginController {

    //勾选框选中后，使用cookie加密保存登录成功后的用户名、密码。再次打开登录页，直接从cookie中解密。
    // （如果一周内免登陆复选框在提交数据时有选中，则跳转前将用户信息存入Cookie，下一次打开登陆页的时候不需要提交用户名密码直接到成功页面。）
    //登录和记住密码，发送用户名和密码到后台进行验证
    @Autowired
    private LoginService loginService;
    @RequestMapping("/login.do")
    @ResponseBody
    public Object login(LoginPage page, HttpServletRequest request, HttpServletResponse response){
        return loginService.login(page,request,response);
    }

    //点击忘记密码按钮，弹出框中输入要重置的账号名和email，发送随机密码给到用户邮箱，并覆盖数据库中的旧密码
    //忘记重置密码，取消此功能
    @Autowired
    private ResetPwdService resetPwdService;
    @RequestMapping("/resetPwd.do")
    @ResponseBody
    public Object resetPwd(LoginPage page){
        return resetPwdService.resetPwd(page);
    }

    //注册新增
    //所有字段都必填。新增字段，用户头像，考察对文件上传，file类的操作
    @Autowired
    private RegisterService registerService;
    @RequestMapping("/register.do")
    @ResponseBody
    public Object register(MultipartFile img, LoginPage page, HttpServletRequest request){
        return registerService.register(img,page,request);
    }
}

