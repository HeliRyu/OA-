package com.bypx.dao;
import com.bypx.page.PermissionPage;
import java.util.List;

//权限管理，管理系统的权限，权限与角色关联
public interface PermissionDao {
    //查询，输入框里输入 权限名 关键词，直接查出相关的权限数据
    //添加查询条件,添加分页
    public List<PermissionPage> query(PermissionPage permissionPage);
    //查询总记录数
    public Integer total (PermissionPage permissionPage);
    //点击 新增 按钮，弹出框 输入权限名，以及权限值
    public Integer add (PermissionPage permissionPage);
    //为了编辑获取数据
    public List<PermissionPage> getdata(PermissionPage permissionPage);
    //编辑
    //勾选 一条数据 点击编辑，弹出框允许修改名与值
    //勾选 多条数据，点击编辑，则提示 “只能修改一条”
    public Integer edit (PermissionPage permissionPage);
    //删除，直接删除勾选的数据，并同时删除关联表数据
    public Integer del(String id);
}
