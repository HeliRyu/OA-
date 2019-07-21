package com.bypx.dao;
import com.bypx.page.DepartmentPage;
import com.bypx.page.RolePage;
import com.bypx.page.UserPage;
import java.util.List;

//用户管理，对系统用户的增删改查功能
//列表头像要显示出来，
//当角色包含经理时，名字要红色显示
//列表字段角色、组织名通过左联查询出来
public interface UserDao {
    //创建表格查询，查询条件：姓名及生日，查出对应的数据，注意控制好分页
    //添加查询条件,添加分页
    public List<UserPage> query(UserPage userPage);
    //查询总记录数
    public Integer total(UserPage userPage);
    //左联角色表和角色用户关联表，查询某用户对应的角色名
    public List<RolePage> getRole(String uid);
    //左联组织表和组织用户关联表，查询某用户对应的组织名
    public List<DepartmentPage> getDepart(String uid);
    //获取数据创建角色树
    public List<RolePage> getRtree(UserPage userPage);
    //获取数据创建组织机构树
    public List<DepartmentPage> getDtree(UserPage userPage);
    //点击新增按钮，弹出框中包含用户信息、以及角色、组织机构名
    //查询该用户的账号是否已存在
    public Long whereAcc(UserPage page);
    //新增到用户表
    public Integer user_add(UserPage page);
    //新增到角色用户关联表
    public Integer user_add2(UserPage page);
    //新增到组织用户关联表
    public Integer user_add3(UserPage page);
    //为了编辑获取数据
    //获取用户表数据
    public List<UserPage> getdata1(UserPage page);
    //在角色用户关联表获取角色数据
    public List<UserPage> getdata2(UserPage page);
    //在组织用户关联表获取组织数据
    public List<UserPage> getdata3(UserPage page);
    //勾选数据，点击编辑按钮 ，弹出框中初始化对应信息，可以任意修改用户数据
    //勾选多条时，提示“只能编辑一条数据”
    //编辑
    //在用户表更新用户
    public Integer edit(UserPage page);
    //在角色用户关联表删除原角色
    public Integer user_del_role(String id);
    //在角色用户关联表添加新角色
    public Integer user_edit_role(UserPage page);
    //在组织用户关联表删除原组织
    public Integer user_del_department(String id);
    //在组织用户关联表添加新组织
    public Integer user_edit_department(UserPage page);
    //删除勾选的数据，并删除关联表数据
    public Integer user_del(String id);
}
