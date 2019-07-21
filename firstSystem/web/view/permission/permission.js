//权限管理，管理系统的权限，权限与角色关联

//查询，输入框里输入 权限名 关键词，直接查出相关的权限数据
var param={};
var page=1;//页号
var row_size=3;//每页个数
var page_size=3;//跨度个数
$(function () {
    $("#search_pername").val("");//清空搜索框
    param.page=page;
    param.size=row_size;
    makelist();
    // 分页条点击事件
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
    param.name=$("#search_pername").val();
    makelist();
}

// 查询填充表格数据,刷新表格
function makelist() {
    param.page=page;
    param.size=row_size;
    $.ajax({
        url:"/permission/query.do",//请求地址
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

// 生成分页条
function appendPage(total) {
    $("#page li").remove();//清空分页
    var html='';
    // 上一页
    html+='<li data-page="'+(page-1)+'"><a href="#">&laquo;</a></li>';
    // 添加前几页
    for(var i=page_size;i>0;i--){
        if((page-i)<1){
            continue;
        }
        html+='<li data-page="'+(page-i)+'"><a href="#">'+(page-i)+'</a></li>';
    }
    // 当前页
    html+='<li class="active" data-page="'+page+'"><a href="#">'+page+'</a></li>';
    // 添加后几页
    for(var i=0;i<page_size;i++){
        if((page+i)*row_size>=total){
            break;
        }
        html+='<li data-page="'+(page+i+1)+'"><a href="#">'+(page+i+1)+'</a></li>';
    }
    // 下一页
    html+='<li data-page="'+(page+1)+'"><a href="#">&raquo;</a></li>';
    $("#page").append(html);

    // 设置左右箭头
    // 当前第一页的时候设置上一页为不可点击
    $("#page li[data-page=0]").addClass("disabled");
    // 当前页为最后一页的时候设置下一页为不可点击
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

//点击 新增 按钮，弹出框 输入权限名，以及权限值
function per_addss() {
    $("#per_adds").attr("disabled",false);
    var name=$("#per_addname").val();
    var flag=$("#per_addsign").val();
    if(!name){
        alert("权限名不可为空");
        return;
    }
    if(!flag){
        alert("标识不可为空");
        return;
    }
    $.ajax({
        url:"/permission/add.do",
        type:"post",
        data:{
            name:name,
            flag:flag
        },
        dataType:"json",
        success:function (json) {
            if(json.success){
                $("#per_adds").attr("disabled",false);
                $('#per_add').modal('hide');//关闭弹窗
                $("#per_addname").val("");//输入框里清除权限名
                $("#per_addsign").val("");//输入框里清除标识
                alert(json.msg);
                page=1;
                makelist();
            }
        },
        error:function () {
            $("#per_adds").attr("disabled",false);
            $("#per_addname").val("");//输入框里清除权限名
            $("#per_addsign").val("");//输入框里清除标识
            alert("服务器异常");
        }
    })
}

//为了编辑获取数据
//勾选 多条数据，点击编辑，则提示 “只能修改一条”
function per_openEdit() {
    var cks=$("#list input[name=ck]:checked");//找到所有勾选中复选框
    if(cks.length==0){
        alert("请选择要编辑的数据");
        $("#per_edits").attr("disabled",false);
        return;
    }
    if(cks.length>1){
        alert("一次只能编辑一条记录");
        $("#per_edits").attr("disabled",false);
        return;
    }
    $.ajax({
        url:"/permission/getdata.do",
        type:"post",
        data:{
            id:cks[0].value//这里的id从何而来？
        },
        dataType:"json",
        success:function (json) {
            if(json.success){
                $("#per_editId").val(json.data[0].id);
                $("#per_editname").val(json.data[0].name);
                $("#per_editsign").val(json.data[0].flag);
                $('#per_edit').modal('show');
                //把勾选去除？
            }else{
                alert(json.msg);
                $("#per_edits").attr("disabled",false);
            }
        },
        error:function () {
            $("#per_edits").attr("disabled",false);
            alert("服务器异常")
        }
    })
}

//编辑
//勾选 一条数据 点击编辑，弹出框允许修改名与值
function per_edits() {
    $("#per_edits").attr("disabled",true);
    $.ajax({
        url:"/permission/edit.do",
        type:"post",
        data:{
            id:$("#per_editId").val(),
            name:$("#per_editname").val(),
            flag:$("#per_editsign").val()
        },
        dataType:"json",
        success:function (json) {
            if(json.success){
                $("#per_edits").attr("disabled",false);
                $('#per_edit').modal('hide');//关闭弹窗
                alert(json.msg);
                page=1;
                makelist();
            }
        },
        error:function () {
            $("#per_edits").attr("disabled",false);
            alert("服务器异常")
        }
    })
}

//删除，直接删除勾选的数据，并同时删除关联表数据
function per_delete(){
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
        url:"/permission/delete.do",
        type:"post",
        data:{
            id:ids.join(",")
        },
        dataType:"json",
        success:function (json) {
            if(json.success){
                $("#per_delete").attr("disabled",false);
                $('#depart_delete').modal('hide');//关闭弹窗
                alert(json.msg);
                page=1;
                makelist();
            }
        },
        error:function () {
            $("#per_delete").attr("disabled",false);
            alert("服务器异常");
        }
    })
}



