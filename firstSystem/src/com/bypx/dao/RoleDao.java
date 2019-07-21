package com.bypx.dao;
import com.bypx.page.RolePage;
import java.util.List;

//角色管理，对系统角色的增删改查功能，权限关联进角色
public interface RoleDao {
    //根据角色名关键词，模糊查询出已有的角色信息
    //创建表格查询
    //添加查询条件,添加分页
    public List<RolePage> query(RolePage rolePage);
    //查询总记录数
    public Integer total(RolePage rolePage);
    //获取数据创建权限树
    public List<RolePage> gettree(RolePage rolePage);
    //点击新增，界面包含所有权限信息，输入角色名、角色标识，可多选权限
    //新增到角色表
    public Integer add1(RolePage rolePage);
    //新增到角色权限关联表
    public Integer add2(RolePage rolePage);
    //为了编辑获取数据
    //获取角色表数据
    public List<RolePage> getdata1(RolePage rolePage);
    //获取角色权限表数据
    public List<RolePage> getdata2(RolePage rolePage);
    //点击 编辑 按钮，界面展示出 所选数据的名与标识，并勾选已有的权限
    //勾选多条时，提示“只能编辑一条数据”
    //编辑
    //在角色表里更新角色
    public Integer edit(RolePage rolePage);
    //在角色权限表删除原来的权限
    public Integer del(String id);
    //在角色权限表添加新的权限
    public Integer add3(RolePage rolePage);
    //删除勾选的数据，并删除关联表数据
    public Integer del2(String id);
}
