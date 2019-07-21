package com.bypx.service;
import com.bypx.page.LoginPage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.HashMap;
import java.util.Map;

@Service
@Transactional
public class ResetPwdService {
    @Autowired
    private JdbcTemplate jdbc;
    public Map resetPwd(LoginPage page){
        Map result=new HashMap();
        String raccount=page.getLaccount();
        String remail=page.getLemail();
        String rpassword=page.getLpassword();
//        发送随机密码给到用户邮箱，并覆盖数据库中的旧密码
        String sql="update firstsystem_user set password_=? where account_=? and email_=?";
        try{
            jdbc.update(sql,rpassword,raccount,remail);
            result.put("success",true);
            result.put("msg","密码修改成功");
            return  result;
        }catch (Exception e){
            result.put("success",false);
            result.put("msg","用户名或邮箱错误");
            return  result;
        }
    }
}

