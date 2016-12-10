(function($){  
    //插件  
    $.extend($,{  
        //命名空间  
        sortTable:{  
        	/**
        	 * tableId 表格id
        	 * Idx	表格排序列索引
        	 * isNumber 要排序的是否为数字类型
        	 * excludeChar 单元格数据排除的字符 只在数字类型单元格有效
        	 * rankIndex  排序号列索引，此列不排序
        	 */
            sort:function(tableId,Idx,isNumber,excludeChar,rankIdx){  
            	if(excludeChar == null){
            		excludeChar = '';
            	}
                var table = document.getElementById(tableId);  
                var tbody = table.tBodies[0];  
                var tr = tbody.rows;   
          
                var trValue = new Array();  
                for (var i=0; i<tr.length; i++ ) {  
                    trValue[i] = tr[i];  //将表格中各行的信息存储在新建的数组中  
                }  
          
                if (tbody.sortCol == Idx) {  
                    trValue.reverse(); //如果该列已经进行排序过了，则直接对其反序排列  
                } else {  
                    if(isNumber){
                    	trValue.sort(function(tr1, tr2){  
                            var value1 = Number(tr1.cells[Idx].innerHTML.replace(excludeChar,''));  
                            var value2 = Number(tr2.cells[Idx].innerHTML.replace(excludeChar,''));  
                            return value1>value2;  
                        });
                    }else{
                    	trValue.sort(function(tr1, tr2){  
                    		var value1 = tr1.cells[Idx].innerHTML;  
                    		var value2 = tr2.cells[Idx].innerHTML;  
                    		return value1.localeCompare(value2);  
                    	});
                    }
                }  
          
                var fragment = document.createDocumentFragment();  //新建一个代码片段，用于保存排序后的结果  
                if(rankIdx >= 0){
                	for (var i=0; i<trValue.length; i++ ) {  
                		trValue[i].cells[rankIdx].innerHTML = i+1;
                		fragment.appendChild(trValue[i]);  
                	}  
                }else{
                	for (var i=0; i<trValue.length; i++ ) {  
                		fragment.appendChild(trValue[i]);  
                	}  
                }
          
                tbody.appendChild(fragment); //将排序的结果替换掉之前的值  
                tbody.sortCol = Idx;  
            }  
        }  
    });         
})(jQuery); 