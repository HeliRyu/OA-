package com.bypx.service;
import com.bypx.dao.UserDao;
import com.bypx.page.DepartmentPage;
import com.bypx.page.RolePage;
import com.bypx.page.UserPage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import javax.servlet.http.HttpServletRequest;
import java.io.File;
import java.io.IOException;
import java.util.*;

//用户管理，对系统用户的增删改查功能
//列表头像要显示出来，
//当角色包含经理时，名字要红色显示
//列表字段角色、组织名通过左联查询出来
@Service
@Transactional
public class UserService {
    @Autowired
    private UserDao userDao;

    //创建表格查询，查询条件：姓名及生日，查出对应的数据，注意控制好分页
    public Map query(UserPage page) {
        Map result = new HashMap();
        int page_=page.getPage();
        int size=page.getSize();

        //添加查询条件,添加分页
        int start_index=(page_-1)*size+1;
        page.setStart_index((page_-1)*size+1);
        page.setEnd_index(start_index+size-1);
        List<UserPage> list=userDao.query(page);
        result.put("data",list);

        //查询总记录数
        int total=userDao.total(page);
        result.put("total",total);

        //左联角色表和角色用户关联表，查询某用户对应的角色名
        for (int i=0;i<list.size();i++){
            String user_id= (String) list.get(i).getId();//拿到每个用户map，拿每个用户的id
            page.setUid(user_id);
            List<RolePage> list_role=userDao.getRole(page.getUid());
            list.get(i).setRolePages(list_role);//将角色名list放入每个用户map里
        }

        //左联组织表和组织用户关联表，查询某用户对应的组织名
        for (int i=0;i<list.size();i++){
            String user_id= (String) list.get(i).getId();//拿到每个用户map，拿每个用户的id
            page.setUid(user_id);
            List<DepartmentPage> list_depart=userDao.getDepart(page.getUid());
            list.get(i).setDepartmentPages(list_depart);//将角色名list放入每个用户map里
        }
        result.put("success",true);
        result.put("msg","获取数据成功");
        return  result;
    }

    //获取数据创建角色树
    public Map getRtree(UserPage page) {
        Map result = new HashMap();
        List<RolePage> list1=userDao.getRtree(page);
        result.put("data",list1);
        result.put("success",true);
        result.put("msg","获取数据成功");
        return  result;
    }

    //获取数据创建组织机构树
    public Map getDtree(UserPage page) {
        Map result = new HashMap();
        List<DepartmentPage> list2=userDao.getDtree(page);
        result.put("data",list2);
        result.put("success",true);
        result.put("msg","获取数据成功");
        return  result;
    }

    //点击新增按钮，弹出框中包含用户信息、以及角色、组织机构名
    public Map add(MultipartFile img, UserPage page, HttpServletRequest request) {
        Map result = new HashMap();
        String[] per_ids1=page.getIds1().split(",");
        String[] per_ids2=page.getIds2().split(",");
        //查询该用户的账号是否已存在
        long i= userDao.whereAcc(page);
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
            String user_id=UUID.randomUUID().toString();
            img.transferTo(file);
            page.setId(user_id);
            page.setPhoto("upload/"+file_name);
            //新增到用户表
            Integer add= userDao.user_add(page);
            //新增到角色用户关联表
            if ((page.getIds1()!=null)&&(!page.getIds1().equals(""))) {
                for (int m = 0; m < per_ids1.length; m++) {
                    page.setId(UUID.randomUUID().toString());
                    page.setUser_id(user_id);
                    page.setR_id(per_ids1[m]);
                    Integer add2 = userDao.user_add2(page);
                }
            }
            //新增到组织用户关联表
            if ((page.getIds2()!=null)&&(!page.getIds2().equals(""))) {
                for (int k = 0; k < per_ids2.length; k++) {
                    page.setId(UUID.randomUUID().toString());
                    page.setUser_id(user_id);
                    page.setD_id(per_ids2[k]);
                    Integer add3 = userDao.user_add3(page);
                }
            }
            result.put("success",true);
            result.put("msg","新增成功");
            return  result;
        } catch (IOException e) {
            e.printStackTrace();
            result.put("success",false);
            result.put("msg","文件上传失败");
            return result;
        }
    }

    //为了编辑获取数据
    public Map getdata(UserPage page) {
        Map result = new HashMap();
        //获取用户表数据
        List<UserPage> list=userDao.getdata1(page);
        //在角色用户关联表获取角色数据
        List<UserPage> list2=userDao.getdata2(page);
        //在组织用户关联表获取组织数据
        List<UserPage> list3=userDao.getdata3(page);
        result.put("data",list);
        result.put("data2",list2);
        result.put("data3",list3);
        result.put("success",true);
        result.put("msg","获取数据成功");
        return  result;
    }

    //勾选数据，点击编辑按钮 ，弹出框中初始化对应信息，可以任意修改用户数据
    //勾选多条时，提示“只能编辑一条数据”
    //编辑
    public Map edit(MultipartFile img, UserPage page, HttpServletRequest request) {
        Map result = new HashMap();
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
            img.transferTo(file);
            //在用户表更新用户
            page.setPhoto("upload/"+file_name);
            userDao.edit(page);
            //在角色用户关联表删除原角色
            userDao.user_del_role(page.getId());
            //在角色用户关联表添加新角色
            String[] role_ids=page.getIds3().split(",");
            if ((page.getIds3()!=null)&&(!page.getIds3().equals(""))) {
                for (int i = 0; i < role_ids.length; i++) {
                    page.setUrid(UUID.randomUUID().toString());
                    page.setRrid(role_ids[i]);
                    Integer user_edit_role = userDao.user_edit_role(page);
                }
            }
            //在组织用户关联表删除原组织
            userDao.user_del_department(page.getId());
            //在组织用户关联表添加新组织
            String[] department_ids=page.getIds4().split(",");
            if ((page.getIds4()!=null)&&(!page.getIds4().equals(""))){
                for (int i = 0; i < department_ids.length; i++) {
                    page.setUdid(UUID.randomUUID().toString());
                    page.setDdid(department_ids[i]);
                    Integer user_edit_department = userDao.user_edit_department(page);
                }
            }
            result.put("success",true);
            result.put("msg","编辑成功");
            return  result;
        } catch (IOException e) {
            e.printStackTrace();
            result.put("success",false);
            result.put("msg","文件上传失败");
            return result;
        }
    }

    //删除勾选的数据，并删除关联表数据
    public Map delete(UserPage page) {
        Map result = new HashMap();
        String[] ids=page.getId().split(",");
        for (int i = 0; i <ids.length ; i++) {
            userDao.user_del(ids[i]);
        }
        result.put("success",true);
        result.put("msg","删除成功");
        return  result;
    }
}

