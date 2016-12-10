#页面导出表格用法  

```javascript
function exportExcel(tableElement,fileName,sheetName){
	if($(tableElement) == null || $(tableElement).length == 0){
		$alert('没有要导出的数据');
		return;
	}
	if(fileName == null || fileName==''){
		fileName = '导出文件';
	}
	if(sheetName == null || sheetName==''){
		sheetName = 'sheet1';
	}
	if($("#txtArea1")==null||$("#txtArea1").length == 0){
		$(tableElement).parent().append('<iframe id="txtArea1" name="txtArea1" width="0" height="0" style="display:none;"></iframe>');
	}
	$(tableElement).tableExport({type: 'excel',tableName:fileName,sheetName:sheetName, separator: ';', escape: 'false' });
}
```