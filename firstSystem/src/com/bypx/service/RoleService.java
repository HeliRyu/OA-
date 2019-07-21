package com.bypx.service;
import com.bypx.dao.RoleDao;
import com.bypx.page.RolePage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.*;

//角色管理，对系统角色的增删改查功能，权限关联进角色
@Service
@Transactional
public class RoleService {
    @Autowired
    private RoleDao roleDao;

    //根据角色名关键词，模糊查询出已有的角色信息
    //创建表格查询
    public Map query(RolePage page) {
        Map result = new HashMap();
        int page_=page.getPage();
        int size=page.getSize();

        //添加查询条件,添加分页
        int start_index=(page_-1)*size+1;
        page.setStart_index((page_-1)*size+1);
        page.setEnd_index(start_index+size-1);
        List<RolePage> list=roleDao.query(page);
        result.put("data",list);

        //查询总记录数
        int total=roleDao.total(page);
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

    //获取数据创建权限树
    public Map gettree(RolePage page) {
        Map result = new HashMap();
        try{
            List<RolePage> list=roleDao.gettree(page);
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

    //点击新增，界面包含所有权限信息，输入角色名、角色标识，可多选权限
    public Map add(RolePage page) {
        Map result = new HashMap();
        //新增到角色表
        page.setRole_id(UUID.randomUUID().toString());
        Integer add1=roleDao.add1(page);
        //新增到角色权限关联表
        String[] per_ids=page.getIds().split(",");
        for (int i = 0;i <per_ids.length;i++) {
            page.setRp_id(UUID.randomUUID().toString());
            page.setPer_id_(per_ids[i]);
            Integer add2=roleDao.add2(page);
        }
        result.put("success",true);
        result.put("msg","新增成功");
        return result;
    }

    //为了编辑获取数据
    public Map getdata(RolePage page) {
        Map result = new HashMap();
        try{
            //获取角色表数据
            List<RolePage> list=roleDao.getdata1(page);
            //获取角色权限表数据
            List<RolePage> list2=roleDao.getdata2(page);
            result.put("data",list);
            result.put("data2",list2);
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

    //点击 编辑 按钮，界面展示出 所选数据的名与标识，并勾选已有的权限
    //勾选多条时，提示“只能编辑一条数据”
    //编辑
    public Map edit(RolePage page) {
        Map result = new HashMap();
        String id=page.getId();
        //在角色表里更新角色
        roleDao.edit(page);
        //在角色权限表删除原来的权限
        roleDao.del(id);
        //在角色权限表添加新的权限
        String[] per_ids=page.getIds().split(",");
        for (int i = 0;i <per_ids.length;i++) {
            page.setRp_id(UUID.randomUUID().toString());
            page.setPer_id_(per_ids[i]);
            Integer add3=roleDao.add3(page);
        }
        result.put("success",true);
        result.put("msg","编辑成功");
        return result;
    }

    //删除勾选的数据，并删除关联表数据
    public Map delete(RolePage page) {
        Map result = new HashMap();
        String[] ids=page.getId().split(",");
        for (int i = 0; i <ids.length ; i++) {
            roleDao.del2(ids[i]);
        }
        result.put("success",true);
        result.put("msg","删除成功");
        return  result;
    }
}

