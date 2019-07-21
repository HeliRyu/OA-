//用户管理，对系统用户的增删改查功能
//列表头像要显示出来，
//当角色包含经理时，名字要红色显示
//列表字段角色、组织名通过左联查询出来

//创建表格查询，查询条件：姓名及生日，查出对应的数据，注意控制好分页
var param={};
var page=1;//页号
var row_size=3;//每页个数
var page_size=3;//跨度个数
$(function () {
    getRtree();
    getDtree();
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
    param.birthday=$("#search_birthday").val();
    makelist();
}

// 查询填充表格数据,刷新表格
function makelist() {
    param.page=page;
    param.size=row_size;
    $.ajax({
        url:"/user/query.do",//请求地址
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
            "<td> <img style='height: 50px;width: 50px' src='../../"+replaceNull(row.photo)+"' class='img-responsive' alt='Responsive image'></td>" ;
        var f=false;
        for(var m=0; m<row.rolePages.length;m++){
            var  rname1=row.rolePages[m].name;
            if(rname1=='经理'){
                f=true;
                break;//结束当前循环
            }
        }
        if(f){
            html+="<td style='color:red'>"+replaceNull(row.name)+"</td>" ;
        }else{
            html+="<td>"+replaceNull(row.name)+"</td>";
        }
        html+= "<td>"+replaceNull(row.account)+"</td>" +
            "<td>"+replaceNull(row.birth)+"</td>" +
            "<td>"+replaceNull(row.email)+"</td>" +
            "<td>"+replaceNull(row.remark)+"</td>";
        var str='';
            for(var j=0; j<row.rolePages.length;j++){
               var  rname=row.rolePages[j].name;
                str+='<span class="label label-info">'+rname+'</span>&nbsp;';
                // str=str+rname+",";
            }
        html+= "<td>"+str+"</td>";
        var str2='';
            for(var k=0;k<row.departmentPages.length;k++){
                dname=row.departmentPages[k].name;
                str2+='<span class="label label-info">'+dname+'</span>&nbsp;';
            }
        html+= "<td>"+str2+"</td>";
        html+="</tr>";
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

//获取数据创建树
var tree;//设置全局变量
var rtree1;
var dtree1;
var rtree2;
var dtree2;
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
            idKey:"id",
            pIdKey: "parentid",//使其有父节点和子节点之分
            rootPId: 0
        }
    }
};

//获取数据创建角色树
function getRtree(){
    $.ajax({
        url:"/user/getRtree.do",//请求地址
        type:'post',//请求方式
        data:{//提交参数
        },
        dataType:"json",//返回结构类型
        success:function (json) {
            rtree1=$.fn.zTree.init($("#roleTree1"), setting,json.data);
            rtree1.expandAll(true);
            rtree2=$.fn.zTree.init($("#roleTree2"), setting,json.data);
            rtree2.expandAll(true);
        },
        error:function () {
            alert("请求失败");
        }
    })
}

//获取数据创建组织机构树
function getDtree(){
    $.ajax({
        url:"/user/getDtree.do",//请求地址
        type:'post',//请求方式
        data:{//提交参数
        },
        dataType:"json",//返回结构类型
        success:function (json) {
            dtree1=$.fn.zTree.init($("#departmentTree1"), setting,json.data);
            dtree1.expandAll(true);
            dtree2=$.fn.zTree.init($("#departmentTree2"), setting,json.data);
            dtree2.expandAll(true);
        },
        error:function () {
            alert("请求失败");
        }
    })
}

//点击新增按钮，弹出框中包含用户信息、以及角色、组织机构名
function user_addss(){
    var account=$("#user_addaccount").val();
    var name=$("#user_addname").val();
    var pass=$("#user_addpassword").val();
    var birth=$("#user_addbirth").val();
    var email=$("#user_addemail").val();
    var remark=$("#user_addremark").val();
    var nodes1 = rtree1.getCheckedNodes(true);
    var ids1=[];
    for(var i=0;i<nodes1.length;i++){
        ids1.push(nodes1[i].id);
    }

    var nodes2 = dtree1.getCheckedNodes(true);
    var ids2=[];
    console.info(nodes2);
    for(var j=0;j<nodes2.length;j++){
        console.info(nodes2[j]);
        ids2.push(nodes2[j].id);
    }
    if(!account){
        alert("账号不可为空");
        return;
    }
    if(!name){
        alert("姓名不可为空");
        return;
    }
    if(!pass){
        alert("密码不可为空");
        return;
    }
    if(!birth){
        alert("生日不可为空");
        return;
    }
    if(!email){
        alert("email不可为空");
        return;
    }
    if(!remark){
        alert("备注不可为空");
        return;
    }
    if(!$("#user_addphoto")[0].files[0]){
        alert("头像不可为空");
        return;
    }
    var f=new FormData();
    f.append("img",$("#user_addphoto")[0].files[0]);
    f.append("account",account);
    f.append("name",name);
    f.append("birth",birth);
    f.append("pass",pass);
    f.append("email",email);
    f.append("remark",remark);
    f.append("ids1",ids1.join(","));
    f.append("ids2",ids2.join(","));
    $.ajax({
        url:"/user/add.do",
        type:"post",
        data:f,
        /**
         *必须false才会自动加上正确的Content-Type
         */
        contentType: false,
        /**
         * 必须false才会避开jQuery对 formdata 的默认处理
         * XMLHttpRequest会对 formdata 进行正确的处理
         */
        processData: false,
        dataType:"json",
        success:function (json) {
            if(json.success){
                $('#user_add').modal('hide');//关闭弹窗
                $("#user_addaccount").val("");
                $("#user_addname").val("");
                $("#user_addpassword").val("");
                $("#user_addbirth").val("");
                $("#user_addemail").val("");
                $("#user_user_addremark").val("");
                $("#user_addphoto").val("");
                rtree1.checkAllNodes(false);//取消当前选中
                dtree1.checkAllNodes(false);//取消当前选中
                alert(json.msg);
                page=1;
                makelist();
            }
        },
        error:function () {
            $("#user_addaccount").val("");
            $("#user_addname").val("");
            $("#user_addpassword").val("");
            $("#user_addbirth").val("");
            $("#user_addemail").val("");
            $("#user_user_addremark").val("");
            alert("服务器异常");
        }
    })
}

//为了编辑获取数据
//勾选多条时，提示“只能编辑一条数据”
// 点击编辑时，编辑框里显示当前选中节点的组织名称，显示编辑弹窗
function user_openEdit() {
    var cks=$("#list input[name=ck]:checked");//找到所有勾选中复选框
    if(cks.length==0){
        alert("请选择要编辑的数据");
        $("#user_adds").attr("disabled",false);
        return;
    }
    if(cks.length>1){
        alert("一次只能编辑一条记录");
        $("#user_adds").attr("disabled",false);
        return;
    }
    $.ajax({
        url:"/user/getdata.do",
        type:"post",
        data:{
            id:cks[0].value//这里的id从何而来？
        },
        dataType:"json",
        success:function (json) {
            if(json.success){
                $("#user_editaccount").val(json.data[0].account);
                $("#user_editname").val(json.data[0].name);
                $("#user_editpassword").val(json.data[0].pass);
                $("#user_editbirth").val(json.data[0].birth);
                $("#user_editemail").val(json.data[0].email);
                $("#user_editremark").val(json.data[0].remark);
                $("#img_photo").attr("src",json.data[0].photo);

                var role_ids=json.data2;
                for(var i=0;i<role_ids.length;i++){
                    var role_id=role_ids[i].role_id_;
                    var node1=rtree2.getNodeByParam("id",role_id,null);
                    rtree2.checkNode(node1,true,false);
                }
                var department_ids=json.data3;
                for(var i=0;i<department_ids.length;i++){
                    var department_id=department_ids[i].department_id_;
                    var node2=dtree2.getNodeByParam("id",department_id,null);
                    dtree2.checkNode(node2,true,false);
                }
                $('#user_edit').modal('show');
            }else{
                alert(json.msg);
                $("#user_edits").attr("disabled",false);
            }
        },
        error:function () {
            $("#user_edits").attr("disabled",false);
            alert("服务器异常")
        }
    })
}

//勾选数据，点击编辑按钮 ，弹出框中初始化对应信息，可以任意修改用户数据
//编辑
function user_editss() {
    var cks=$("#list input[name=ck]:checked");//找到所有勾选中复选框
    $("#user_edits").attr("disabled",true);
    var id=cks[0].value;
    var account=$("#user_editaccount").val();
    var name=$("#user_editname").val();
    var pass=$("#user_editpassword").val();
    var birth=$("#user_editbirth").val();
    var email=$("#user_editemail").val();
    var remark=$("#user_editremark").val();
    var photo=$("#user_editphoto")[0].files[0];

    var nodes3 = rtree2.getCheckedNodes(true);
    var ids3=[];
    for(var i=0;i<nodes3.length;i++){
        ids3.push(nodes3[i].id);
    }

    var nodes4 = dtree2.getCheckedNodes(true);
    var ids4=[];
    for(var i=0;i<nodes4.length;i++){
        ids4.push(nodes4[i].id);
    }

    var f2=new FormData();
    f2.append("img",photo);
    f2.append("id",id);
    f2.append("account",account);
    f2.append("name",name);
    f2.append("birth",birth);
    f2.append("pass",pass);
    f2.append("email",email);
    f2.append("remark",remark);
    f2.append("ids3",ids3.join(","));
    f2.append("ids4",ids4.join(","));

    $.ajax({
        url:"/user/edit.do",
        type:"post",
        data:f2,
        /**
         *必须false才会自动加上正确的Content-Type
         */
        contentType: false,
        /**
         * 必须false才会避开jQuery对 formdata 的默认处理
         * XMLHttpRequest会对 formdata 进行正确的处理
         */
        processData: false,
        dataType:"json",
        success:function (json) {
            if(json.success){
                $("#user_edits").attr("disabled",false);
                $('#user_edit').modal('hide');//关闭弹窗
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

//删除勾选的数据，并删除关联表数据
function user_delete(){
    $("#user_delete").attr("disabled",true);
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
        url:"/user/delete.do",
        type:"post",
        data:{
            id:ids.join(",")
        },
        dataType:"json",
        success:function (json) {
            if(json.success){
                $("#user_delete").attr("disabled",false);
                alert(json.msg);
                page=1;
                makelist();
            }
        },
        error:function () {
            $("#user_delete").attr("disabled",false);
            alert("服务器异常");
        }
    })
}



