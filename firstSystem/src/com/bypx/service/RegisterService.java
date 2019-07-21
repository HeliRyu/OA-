package com.bypx.service;
import com.bypx.dao.LoginDao;
import com.bypx.page.LoginPage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import javax.servlet.http.HttpServletRequest;
import java.io.File;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

//注册新增
//所有字段都必填。新增字段，用户头像，考察对文件上传，file类的操作
@Service
@Transactional
public class RegisterService {
    @Autowired
    private LoginDao loginDao;

    public Map register(MultipartFile img, LoginPage page, HttpServletRequest request) {
        Map result = new HashMap();
        //查询账户是否存在
        long i= loginDao.register(page);
        if (i > 0) {
            result.put("success", false);
            result.put("msg", "账户已存在");
            return  result;
        }
        //上传头像
        String OriginalFilename=img.getOriginalFilename();
        String suffix=OriginalFilename.substring(OriginalFilename.lastIndexOf("."));
        if (!suffix.equals(".jpg")&&!suffix.equals(".gif")&&!suffix.equals("png")){
            result.put("success", false);
            result.put("msg", "文件类型错误");
            return result;
        }
        if (img.getSize()>1024*1024*2){
            result.put("success", false);
            result.put("msg", "文件超过2m");
            return result;
        }
        //上传文件夹地址
        String up_dir_path=request.getRealPath("/upload");
        File up_dir=new File(up_dir_path);//上传文件夹
        if (!up_dir.exists()){//如果文件夹不存在则创建文件夹
            up_dir.mkdirs();
        }
        //新文件名
        String file_name= UUID.randomUUID().toString()+suffix;
        //新文件路径
        String file_path=up_dir_path+"/"+file_name;
        File file=new File(file_path);
        try{
            //注册新增
            img.transferTo(file);
            page.setLphoto("upload/"+file_name);
            Integer add= loginDao.register_add(page);
                if (add>0){
                    result.put("success", true);
                    result.put("msg", "注册成功");
                    return result;
                }else{
                    result.put("success", false);
                    result.put("msg", "数据有误");
                    return result;
                }
        }catch (IOException e){
            e.printStackTrace();
            result.put("success",false);
            result.put("msg","文件上传失败");
            return result;
        }
    }
}

