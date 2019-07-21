//组织管理

//获取数据建成树
//树形结构表示当前的组织关系，右键任意一个节点，弹出编辑、添加下级、删除的相关操作
var tree;//设置全局变量
var setting = {
    data: {
        key: {
            name: "name"
        },
        simpleData: {
            enable: true,
            idKey: "id",
            pIdKey: "parentid",////使其有父节点和子节点之分
            rootPId: 0
        }
    },
    callback: { //回调函数
        onRightClick: zTreeOnRightClick //右键事件  
    }
};

// 取数据形成树
$(function(){
    document.onclick=function(){
        $("#rmenu").hide();
    };
    $.ajax({
        url:"/department/getdata.do",//请求地址
        type:'post',//请求方式
        data:{//提交参数
        },
        dataType:"json",//返回结构类型
        success:function (json) {
            tree=$.fn.zTree.init($("#departmentTree"), setting,json.data);
            tree.expandAll(true);
        },
        error:function () {
            alert("请求失败");
        }
    })
});

// zTree树节点右键单击出现菜单选项
function zTreeOnRightClick(event, treeId, treeNode) {
    var nodes = tree.getSelectedNodes();//获取当前被选中的节点数据集合
    // 如果没有选中节点，只能添加下级。选中节点后，才可以编辑、添加、移除。
    if(nodes.length==0){
        $('#editNode').hide();
        $('#deleteNode').hide();
    }else{
        $('#editNode').show();
        $('#deleteNode').show();
    }
    // 设置菜单的位置
    $("#rmenu").css("left",event.clientX+"px");
    $("#rmenu").css("top",event.clientY+"px");
    $("#rmenu").show();
}

// 点击编辑时，编辑框里显示当前选中节点的组织名称，显示编辑弹窗，弹出框只能修改组织名称
function openEdit() {
    var nodes = tree.getSelectedNodes();//获取当前被选中的节点数据集合
    // 下标为0，因为只上传了一个list，注意键要大写字母。先取值，再传值。id也要传，后面才能写sql，隐藏。
    //使用mybatis后大写字母改为小写字母。
    $("#depart_editname").val(nodes[0].name);
    $("#depart_editId").val(nodes[0].id);
    $('#depart_edit').modal('show');
}

// 编辑
function edit_save() {
    $("#edit_save").attr("disabled",true);
    var nodes=tree.getSelectedNodes();
    $.ajax({
        url:"/department/edit.do",
        type:"post",
        data:{
            id:$("#depart_editId").val(),
            name:$("#depart_editname").val()
        },
        dataType:"json",
        success:function (json) {
            if(json.success){
                $("#edit_save").attr("disabled",false);
                $('#depart_edit').modal('hide');//关闭弹窗
                alert(json.msg);
                getdata();
            }
        },
        error:function () {
            $("#edit_save").attr("disabled",false);
            alert("服务器异常")
        }
    })
}

//点击 添加下级 按钮，弹出框 输入新的组织名，完成后，自动刷新组织树
function add_save() {
    $("#add_save").attr("disabled",true);
    var nodes=tree.getSelectedNodes();//获取当前被选中的节点数据集合
    var name=$("#depart_addname").val();
    if(!name){//如果没有填写要添加的组织名
        alert("组织名不可为空");
        return;
    }
    var pid;
    if (nodes.length==0){//如果在空白处点击添加下级
        pid=null;
    } else {
        pid=nodes[0].id;
    }
    $.ajax({
        url:"/department/add.do",
        type:"post",
        data:{
            name:name,
            parentid:pid
        },
        dataType:"json",
        success:function (json) {
            if(json.success){
                var nodes = tree.getSelectedNodes();//获取当前被选中的节点数据集合
                var newNode = {name:"newNode1"};//给定一个要添加的新节点
                if(nodes.length>0){//把这个新节点添加到当前选中的节点下，作为它的子节点
                    newNode = tree.addNodes(nodes[0], newNode);
                }
                //自动刷新树
                getdata();
                $("#add_save").attr("disabled",false);
                $('#depart_add').modal('hide');//关闭弹窗
                $("#depart_addname").val("");//输入框里清除数据
                alert(json.msg);
            }
        },
        error:function () {
            $("#add_save").attr("disabled",false);
            $("#depart_addname").val("");//输入框里清除数据
            alert("服务器异常");
        }
    })
}

//移除
//1）点击 移除 按钮，弹出确认框，确认后删除下级组织，并刷新组织树
//2）若该组织为根节点，不允许删除
//3）若该组织已关联用户，不允许删除（在组织用户关系表设立外键）：（设立了用户外键，删除用户，组织用户关系表里也删除）
//4）若有下级，则同时删除下级组织（在组织表里设立外键）
function delete_save(){
    $("#delete_save").attr("disabled",true);
    var nodes=tree.getSelectedNodes();//获取当前被选中的节点数据集合
    var ppid=nodes[0].parentid;
    var id=nodes[0].id;
    // 该组织为根节点，不允许删除，请使用ztree属性设置
    if(ppid=0){
        alert("该组织为根节点，不允许删除");
        return;
    }
    // 若该组织已关联用户，不允许删除。在组织用户关系表设立外键。
    // 删除及删除下级组织，并刷新组织树
    $.ajax({
        url:"/department/delete.do",
        type:"post",
        data:{
            id:id
        },
        dataType:"json",
        success:function (json) {
            if(json.success){
                var nodes = tree.getSelectedNodes();//获取当前被选中的节点数据集合
                // 删除所有选中的节点
                for (var i=0, l=nodes.length; i < l; i++) {
                    tree.removeNode(nodes[i]);
                }
                //自动刷新树
                getdata();
                $("#delete_save").attr("disabled",false);
                $('#depart_delete').modal('hide');//关闭弹窗
                alert(json.msg);
            }
        },
        error:function () {
            $("#delete_save").attr("disabled",false);
            alert("服务器异常");
        }
    })
}

//完成后，自动刷新组织树
function getdata() {
    $.ajax({
        url:"/department/getdata.do",//请求地址
        type:'post',//请求方式
        data:{//提交参数
        },
        dataType:"json",//返回结构类型
        success:function (json) {
            tree=$.fn.zTree.init($("#departmentTree"), setting,json.data);
            tree.expandAll(true);
        },
        error:function () {
            alert("请求失败");
        }
    });
}