//角色管理，对系统角色的增删改查功能，权限关联进角色

//根据角色名关键词，模糊查询出已有的角色信息
//创建表格查询
var param={};
var page=1;//页号
var row_size=3;//每页个数
var page_size=3;//跨度个数
$(function () {
    gettree();
    $("#search_rolename").val("");//清空搜索框
    param.page=page;
    param.size=row_size;
    makelist();
    //分页条点击事件
    $("#page").on("click","li",function () {
        var li=$(this);
        if(li.hasClass("disabled")||li.hasClass("active")){//当前页或者不可操作
            return;
        }
        // 修改当前页号，重新获取数据
        var page_=new Number(li.attr("data-page"));
        page=page_;
        makelist();//页面加载后执行查询数据库，填充表格
    });
});

//查询
function search_ok(){
    page=1;
    param.name=$("#search_rolename").val();
    makelist();
}

// 查询填充表格数据,刷新表格
function makelist() {
    param.page=page;
    param.size=row_size;
    $.ajax({
        url:"/role/query.do",//请求地址
        type:'post',//请求方式
        data:param,
        dataType:"json",//返回结构类型
        success:function (json) {
            appendTable(json.data);
            appendPage(json.total);
        },
        error:function () {
            alert("请求失败");
        }
    });
}

//生成分页条
function appendPage(total) {
    $("#page li").remove();//清空分页
    var html='';
    //上一页
    html+='<li data-page="'+(page-1)+'"><a href="#">&laquo;</a></li>';
    //添加前几页
    for(var i=page_size;i>0;i--){
        if((page-i)<1){
            continue;
        }
        html+='<li data-page="'+(page-i)+'"><a href="#">'+(page-i)+'</a></li>';
    }
    //当前页
    html+='<li class="active" data-page="'+page+'"><a href="#">'+page+'</a></li>';
    //添加后几页
    for(var i=0;i<page_size;i++){
        if((page+i)*row_size>=total){
            break;
        }
        html+='<li data-page="'+(page+i+1)+'"><a href="#">'+(page+i+1)+'</a></li>';
    }
    //下一页
    html+='<li data-page="'+(page+1)+'"><a href="#">&raquo;</a></li>';
    $("#page").append(html);

    //设置左右箭头
    //当前第一页的时候设置上一页为不可点击
    $("#page li[data-page=0]").addClass("disabled");
    //当前页为最后一页的时候设置下一页为不可点击
    if(page*row_size>=total){
        $("#page li:last-child").addClass("disabled");
    }
}

//生成表格数据
function appendTable(data) {
    $("#list tr").remove();//清空原有数据
    var html='';
    var i=1;
    data.forEach(function (row) {
        html+="<tr>" +
            "<td>"+i+"</td>" +
            "<td><input type='checkbox' name='ck' value='"+replaceNull(row.id)+"'></td>" +
            "<td>"+replaceNull(row.name)+"</td>" +
            "<td>"+replaceNull(row.flag)+"</td>" +
            "</tr>";
        i++;
    });
    $("#list").append(html);//添加数据
}

//生成表格数据中处理null值
function replaceNull(obj){
    if(obj===null||obj===undefined){
        return "";
    }
    return obj;
}

//获取数据创建权限树
var tree;//设置全局变量
var tree2;
var setting = {
    check: {
        enable: true,
        chkStyle: "checkbox",
        chkboxType: { "Y": "p", "N": "s" }//级联关系
    },
    data: {
        key: {
            name: "name"
        },
        simpleData: {
            enable: true,
            idKey:"id"
        }
    }
};

// 取数据形成树
function gettree(){
    $.ajax({
        url:"/role/gettree.do",//请求地址
        type:'post',//请求方式
        data:{//提交参数
        },
        dataType:"json",//返回结构类型
        success:function (json) {
            tree=$.fn.zTree.init($("#permissionTree"), setting,json.data);
            tree.expandAll(true);
            tree2=$.fn.zTree.init($("#permissionTree2"), setting,json.data);
            tree2.expandAll(true);
        },
        error:function () {
            alert("请求失败");
        }
    })
}

//点击新增，界面包含所有权限信息，输入角色名、角色标识，可多选权限
function role_addss() {
    $("#role_adds").attr("disabled",false);
    var name=$("#role_addname").val();
    var flag=$("#role_addsign").val();
    var nodes = tree.getCheckedNodes(true);
    var ids=[];
    for(var i=0;i<nodes.length;i++){
        ids.push(nodes[i].id);
    }
    if(!name){
        alert("权限名不可为空");
        return;
    }
    if(!flag){
        alert("标识不可为空");
        return;
    }
    $.ajax({
        url:"/role/add.do",
        type:"post",
        data:{
            name:name,
            flag:flag,
            ids:ids.join(",")
        },
        dataType:"json",
        success:function (json) {
            if(json.success){
                $("#role_adds").attr("disabled",false);
                $('#role_add').modal('hide');//关闭弹窗
                $("#role_addname").val("");//输入框里清除权限名
                $("#role_addsign").val("");//输入框里清除标识
                tree.checkAllNodes(false);//取消当前选中
                alert(json.msg);
                page=1;
                makelist();
            }
        },
        error:function () {
            $("#role_adds").attr("disabled",false);
            $("#role_addname").val("");//输入框里清除权限名
            $("#role_addsign").val("");//输入框里清除标识
            alert("服务器异常");
        }
    })
}

//为了编辑获取数据
//点击 编辑 按钮，界面展示出 所选数据的名与标识，并勾选已有的权限
//勾选多条时，提示“只能编辑一条数据”
function role_openEdit() {
    var cks=$("#list input[name=ck]:checked");//找到所有勾选中复选框
    if(cks.length==0){
        alert("请选择要编辑的数据");
        $("#role_edits").attr("disabled",false);
        return;
    }
    if(cks.length>1){
        alert("一次只能编辑一条记录");
        $("#role_edits").attr("disabled",false);
        return;
    }
    $.ajax({
        url:"/role/getdata.do",
        type:"post",
        data:{
            id:cks[0].value
        },
        dataType:"json",
        success:function (json) {
            if(json.success){
                $("#role_editId").val(json.data[0].id);
                $("#role_editname").val(json.data[0].name);
                $("#role_editsign").val(json.data[0].flag);
                var permission_ids=json.data2;
                for(var i=0;i<permission_ids.length;i++){
                    var permission_id=permission_ids[i].per_id_;
                    var node=tree2.getNodeByParam("id",permission_id,null);
                    tree2.checkNode(node,true,false);
                }
                $('#role_edit').modal('show');
            }else{
                alert(json.msg);
                $("#role_edits").attr("disabled",false);
            }
        },
        error:function () {
            $("#role_edits").attr("disabled",false);
            alert("服务器异常")
        }
    })
}

//编辑
function role_edits() {
    $("#role_edits").attr("disabled",true);
    var nodes2 = tree2.getCheckedNodes(true);
    var ids2=[];
    for(var i=0;i<nodes2.length;i++){
        ids2.push(nodes2[i].id);
    }
    $.ajax({
        url:"/role/edit.do",
        type:"post",
        data:{
            id:$("#role_editId").val(),
            name:$("#role_editname").val(),
            flag:$("#role_editsign").val(),
            ids:ids2.join(",")
        },
        dataType:"json",
        success:function (json) {
            if(json.success){
                $("#role_edits").attr("disabled",false);
                $('#role_edit').modal('hide');//关闭弹窗
                alert(json.msg);
                page=1;
                makelist();
            }
        },
        error:function () {
            $("#role_edits").attr("disabled",false);
            alert("服务器异常")
        }
    })
}

//删除勾选的数据，并删除关联表数据
function role_delete(){
    var cks=$("#list input[name=ck]:checked");
    if(cks.length==0){
        alert("请选择要删除的数据");
        return;
    }
    var f=confirm("是否确认删除？");
    if(!f){
        return;
    }
    var ids=[];
    cks.each(function () {
        ids.push(this.value);//获取每一行选中的id
    });
    $.ajax({
        url:"/role/delete.do",
        type:"post",
        data:{
            id:ids.join(",")
        },
        dataType:"json",
        success:function (json) {
            if(json.success){
                $("#role_delete").attr("disabled",false);
                alert(json.msg);
                page=1;
                makelist();
            }
        },
        error:function () {
            $("#role_delete").attr("disabled",false);
            alert("服务器异常");
        }
    })
}



