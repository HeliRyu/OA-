package com.bypx.controller;
import com.bypx.page.RolePage;
import com.bypx.service.RoleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import java.util.HashMap;
import java.util.Map;

//角色管理，对系统角色的增删改查功能，权限关联进角色
@Controller
@RequestMapping("/role")
public class RoleController {
    @Autowired
    private RoleService roleService;

    //根据角色名关键词，模糊查询出已有的角色信息
    //创建表格查询
    @RequestMapping("/query.do")
    @ResponseBody
    public Object query(RolePage page){
        return roleService.query(page);
    }

    //获取数据创建权限树
    @RequestMapping("/gettree.do")
    @ResponseBody
    public Object gettree(RolePage page){
        return roleService.gettree(page);
    }

    //点击新增，界面包含所有权限信息，输入角色名、角色标识，可多选权限
    @RequestMapping("/add.do")
    @ResponseBody
    public Object add(RolePage page){
        try{
            return roleService.add(page);
        }catch (Exception e){
            e.printStackTrace();
            Map result = new HashMap();
            result.put("success",false);
            result.put("msg","新增失败");
            return result;
        }
    }

    //为了编辑获取数据
    @RequestMapping("/getdata.do")
    @ResponseBody
    public Object getdata(RolePage page){
        return roleService.getdata(page);
    }

    //点击 编辑 按钮，界面展示出 所选数据的名与标识，并勾选已有的权限
    //勾选多条时，提示“只能编辑一条数据”
    //编辑
    @RequestMapping("/edit.do")
    @ResponseBody
    public Object edit(RolePage page){
        try{
            return roleService.edit(page);
        }catch (Exception e){
            e.printStackTrace();
            Map result = new HashMap();
            result.put("success",false);
            result.put("msg","编辑失败");
            return result;
        }
    }

    //删除勾选的数据，并删除关联表数据
    @RequestMapping("/delete.do")
    @ResponseBody
    public Object delete(RolePage page){
        try{
            return roleService.delete(page);
        }catch (Exception e){
            e.printStackTrace();
            Map result = new HashMap();
            result.put("success",false);
            result.put("msg","删除失败");
            return result;
        }
    }
}

