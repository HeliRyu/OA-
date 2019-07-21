package com.bypx.dao;
import com.bypx.page.DepartmentPage;
import java.util.List;

//组织管理
public interface DepartmentDao {
    //获取数据建成树
    //树形结构表示当前的组织关系，右键任意一个节点，弹出编辑、添加下级、删除的相关操作
    public List<DepartmentPage> getdata(DepartmentPage departmentPage);
    //点击编辑按钮 弹出框只能修改组织名称
    public Integer edit(DepartmentPage departmentPage);
    //点击 添加下级 按钮，弹出框 输入新的组织名，完成后，自动刷新组织树
    public Integer add(DepartmentPage departmentPage);
    //移除
    //1）点击 移除 按钮，弹出确认框，确认后删除下级组织，并刷新组织树
    //2）若该组织为根节点，不允许删除
    //3）若该组织已关联用户，不允许删除（在组织用户关系表设立外键）：（设立了用户外键，删除用户，组织用户关系表里也删除）
    //4）若有下级，则同时删除下级组织（在组织表里设立外键）
    public Integer del(String id);
}
