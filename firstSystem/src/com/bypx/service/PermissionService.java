package com.bypx.service;
import com.bypx.dao.PermissionDao;
import com.bypx.page.PermissionPage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.*;

//权限管理，管理系统的权限，权限与角色关联
@Service
@Transactional
public class PermissionService {
    @Autowired
    private PermissionDao permissionDao;

    //查询，输入框里输入 权限名 关键词，直接查出相关的权限数据
    public Map query(PermissionPage page) {
        Map result = new HashMap();
        int page_=page.getPage();
        int size=page.getSize();

        //添加查询条件,添加分页
        int start_index=(page_-1)*size+1;
        page.setStart_index((page_-1)*size+1);
        page.setEnd_index(start_index+size-1);

        List<PermissionPage> list=permissionDao.query(page);
        result.put("data",list);

        //查询总记录数
        int total=permissionDao.total(page);
        if(total>0){
            result.put("total",total);
            result.put("success",true);
            result.put("msg","获取数据成功");
            return  result;
        }else{
            result.put("success",false);
            result.put("msg","数据有误");
            return result;
        }
    }

    //点击 新增 按钮，弹出框 输入权限名，以及权限值
    public Map add(PermissionPage page) {
        Map result = new HashMap();
        Integer add=permissionDao.add(page);
        if (add>0){
            result.put("success",true);
            result.put("msg","新增成功");
            return  result;
        }else{
            result.put("success",false);
            result.put("msg","数据有误");
            return result;
        }
    }

    //为了编辑获取数据
    public Map getdata(PermissionPage page) {
        Map result = new HashMap();
        try{
            List<PermissionPage> list=permissionDao.getdata(page);
            result.put("data",list);
            result.put("success",true);
            result.put("msg","获取数据成功");
            return  result;
        }catch(Exception e){
            e.printStackTrace();
            result.put("success",false);
            result.put("msg","数据有误");
            return result;
        }
    }

    //编辑
    //勾选 一条数据 点击编辑，弹出框允许修改名与值
    //勾选 多条数据，点击编辑，则提示 “只能修改一条”
    public Map edit(PermissionPage page) {
        Map result = new HashMap();
        Integer edit=permissionDao.edit(page);
            if (edit>0){
                result.put("success",true);
                result.put("msg","编辑成功");
                return  result;
            }else{
                result.put("success",false);
                result.put("msg","数据有误");
                return result;
            }
    }

    //删除，直接删除勾选的数据，并同时删除关联表数据
    public Map delete(PermissionPage page) {
        Map result = new HashMap();
        int del=0;
        String[] ids=page.getId().split(",");
        for (int i = 0; i <ids.length ; i++) {
                del=permissionDao.del(ids[i]);
        }
        if(del>0){
            result.put("success",true);
            result.put("msg","删除成功");
            return  result;
        }else{
            result.put("success",false);
            result.put("msg","数据有误");
            return result;
        }
    }
}

