package com.bypx.controller;
import com.bypx.page.PermissionPage;
import com.bypx.service.PermissionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import java.util.HashMap;
import java.util.Map;

//权限管理，管理系统的权限，权限与角色关联
@Controller
@RequestMapping("/permission")
public class PermissionController {
    @Autowired
    private PermissionService permissionService;

    //查询，输入框里输入 权限名 关键词，直接查出相关的权限数据
    @RequestMapping("/query.do")
    @ResponseBody
    public Object query(PermissionPage page){
        return permissionService.query(page);
    }

    //点击 新增 按钮，弹出框 输入权限名，以及权限值
    @RequestMapping("/add.do")
    @ResponseBody
    public Object add(PermissionPage page){
        return permissionService.add(page);
    }

    //为了编辑获取数据
    @RequestMapping("/getdata.do")
    @ResponseBody
    public Object getdata(PermissionPage page){
        return permissionService.getdata(page);
    }

    //编辑
    //勾选 一条数据 点击编辑，弹出框允许修改名与值
    //勾选 多条数据，点击编辑，则提示 “只能修改一条”
    @RequestMapping("/edit.do")
    @ResponseBody
    public Object edit(PermissionPage page){
        return permissionService.edit(page);
}

    //删除，直接删除勾选的数据，并同时删除关联表数据
    @RequestMapping("/delete.do")
    @ResponseBody
    public Object delete(PermissionPage page){
        try{
            return permissionService.delete(page);
        }catch (Exception e){
            e.printStackTrace();
            Map result = new HashMap();
            result.put("success",false);
            result.put("msg","删除失败");
            return result;
        }
    }
}

