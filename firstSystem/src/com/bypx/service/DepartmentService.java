package com.bypx.service;
import com.bypx.dao.DepartmentDao;
import com.bypx.page.DepartmentPage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

//组织管理
@Service
@Transactional
public class DepartmentService {
    @Autowired
    private DepartmentDao departmentDao;

    //获取数据建成树
    //树形结构表示当前的组织关系，右键任意一个节点，弹出编辑、添加下级、删除的相关操作
    public Map getdata(DepartmentPage page) {
        Map result = new HashMap();
        List<DepartmentPage> list=departmentDao.getdata(page);
        result.put("data",list);
        return result;
    }

    //点击编辑按钮 弹出框只能修改组织名称
    public Map edit(DepartmentPage page) {
        Map result = new HashMap();
        Integer edit=departmentDao.edit(page);
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

    //点击 添加下级 按钮，弹出框 输入新的组织名，完成后，自动刷新组织树
    public Map add(DepartmentPage page) {
        Map result = new HashMap();
        Integer add=departmentDao.add(page);
        if(add>0){
            result.put("success",true);
            result.put("msg","添加下级成功");
            return  result;
        }else{
            result.put("success",false);
            result.put("msg","数据有误");
            return result;
        }
    }

    //移除
    //1）点击 移除 按钮，弹出确认框，确认后删除下级组织，并刷新组织树
    //2）若该组织为根节点，不允许删除
    //3）若该组织已关联用户，不允许删除（在组织用户关系表设立外键）：（设立了用户外键，删除用户，组织用户关系表里也删除）
    //4）若有下级，则同时删除下级组织（在组织表里设立外键）
    public Map delete(DepartmentPage page) {
        Map result = new HashMap();
        String id=page.getId();
        Integer del=departmentDao.del(id);
        if (del>0) {
            result.put("success", true);
            result.put("msg", "移除成功");
            return result;
        }else{
            result.put("success",false);
            result.put("msg","数据有误");
            return result;
        }
    }
}

