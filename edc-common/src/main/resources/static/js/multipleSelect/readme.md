
#multipleSelect 用法

1.在使用页面引入样式 
"/css/multipleSelect/jquery-ui.css",
"/css/multipleSelect/jquery.multiselect.css"

2.引入js
"/js/multipleSelect/jquery-ui.min.js",
"/js/multipleSelect/jquery.multiselect.js" 

3.应用multiselect，放到具体业务需求的位置（同input元素一样）

<select id="areaIdQ" keyid="areaId" labelid="areaName" multiple="multiple" style="width:150px">
  <option value="1">options 1</option>
      <option value="2">options 2</option>
      <option value="3">options 3</option>
      <option value="4">options 4</option>
</select>  

4.初始化multiselect
            $("#areaIdQ").multiselect({
        noneSelectedText: "请选择区域",   
        checkAllText: "全选", 
        uncheckAllText: '全不选', 
        minWidth:150, 
        selectedText:function(numChecked,totalOptNum,checked){ 
            var arr = [];
            $(checked).each(function(){
                arr.push($(this).val());
            });
            getCinemas(arr.join(','));
        }
    }); 
    
初始化参数说明 
    参数名	描述
noneSelectedText	未选择任何值的时候，显示文本，默认为： Select options
checkAllText	全选按钮 显示文本，默认为：Check all
uncheckAllText	全不选按钮 显示文本，默认为：Uncheck all
minWidth	下拉框最小宽度 
selectedText	当选择值有变化时候的回调函数，参数为：（选中数量，总选项数量，选中的input元素对象数组）

5.常用方法 

open	打开下拉框
close	关闭下拉框
isOpen	判断是否已经打开
checkAll	全选
uncheckAll	取消全选
getChecked	获取选中对象
getUnchecked	获取未选中对象

方法使用示例：
var checked = $("#areaIdQ").multiselect("getChecked");

    