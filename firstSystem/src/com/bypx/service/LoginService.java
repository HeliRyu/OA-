package com.bypx.service;
import com.bypx.dao.LoginDao;
import com.bypx.page.LoginPage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.util.HashMap;
import java.util.Map;

//登录
@Service
@Transactional
public class LoginService {
    @Autowired
    private LoginDao loginDao;

    //勾选框选中后，使用cookie加密保存登录成功后的用户名、密码。再次打开登录页，直接从cookie中解密。
    // （如果一周内免登陆复选框在提交数据时有选中，则跳转前将用户信息存入Cookie，下一次打开登陆页的时候不需要提交用户名密码直接到成功页面。）
    //登录和记住密码，发送用户名和密码到后台进行验证
    public Map login(LoginPage page, HttpServletRequest request, HttpServletResponse response){
        Map result=new HashMap();
        String laccount=page.getLaccount();
        long total= loginDao.login(page);
        if (total>0){
            //使用cookie加密保存登录成功后的用户名和密码
            Cookie cookie=new Cookie("account",laccount);
            cookie.setMaxAge(60*60*24*7);
            cookie.setPath("/");
            response.addCookie(cookie);

            HttpSession session=request.getSession();
            session.setAttribute("account",laccount);
            result.put("success",true);
            result.put("msg","登录成功");
            return  result;
        }
        result.put("success",false);
        result.put("msg","用户名或密码错误");
        return  result;
    }
}
