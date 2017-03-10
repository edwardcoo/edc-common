$().ready(function(){
	$("#year").on("change",function(){
		//填充周下拉列表
        setWeekDatas('#weeks',this.value);
	});
	$("#year").trigger('change');
})


/**
 * 动态填充某年的周下拉列表
 * @param selectObj select下拉框 jq对象
 * @param year 设置某年的周列表
 */
function setWeekDatas(selectObj,year){
	var _select_week = $(selectObj);
	_select_week.empty();
	if(year == null || year == ''){
		return;
	}
	var numOfWeeks;
	//获取今天所属当年第N周
	var date = new Date();
	var nowYear = date.getFullYear();
	if(nowYear == year){
		var nowYearWeek = getYearWeek(date);
		//计算要显示的周数为当前周的前一周
//		if(nowYearWeek < 2){
//			year -= 1;
//			numOfWeeks = getNumOfWeeks(year);
//		}else{
//			numOfWeeks = nowYearWeek -1;
			numOfWeeks = nowYearWeek ;
//		}
	}else{
		numOfWeeks = getNumOfWeeks(year);
	}
	for(var i = numOfWeeks;i>= 1;i--){
		_select_week.append('<option value="'+i+'">第'+i+'周('+getDateRange(year,i)+')</option>');
	}
}

/**
 * 获取某年一共有多少周
 */
function getNumOfWeeks(year){
	if(year == null || year == ''){
		year = new Date().getFullYear(); //获取当前年
	}
	var date = new Date(year,0,1);
	var days = isLeapYear(year)?366:365;
	var week =  Math.ceil((days-date.getDay())/7.0);
	if(date.getDay() != 1){ // 如果1月1日不是周一，就加一周
		week++;
	}
	return week;
}

/**
 * 获取某年第N周的时间范围
 */
function getDateRange(_year,_week){
	var beginDate;
	var endDate;
	if(_year == null || _year == '' ||_week == null || _week == ''){
		return '';
	}
	//判断1月1日是周几
	var date = new Date(_year,0,1);
	var weekNo = date.getDay()-1;		//0周一~6周日
	if(weekNo < 0){
		weekNo = 6;
	}
	if(_week == 1 && weekNo != 0){// 如果是第一周，并且1月1日不是周一，就单独显示
		beginDate = date;
		var time = date.getTime()+(6-weekNo)*24*3600000;
		endDate = new Date(time);
	}else if(_week == getNumOfWeeks(_year)){ //最后一周，结束日期为12月31日
		_week--;
		beginDate = getXDate(_year,_week,1);
		endDate = new Date(_year,11,31);
	}else{
		_week--;
		beginDate = getXDate(_year,_week,1);
		endDate = getXDate(_year,(_week - 0 + 1),7);
	}
    return getFormatDate(beginDate) + "至"+ getFormatDate(endDate);
}

/**
 * 判断是否为闰年
 */
function isLeapYear(year){
	return (( year%4==0 && year%100!=0) || year%400==0);
}

/**
 * 这个方法将取得某年(year)第几周(weeks)的星期几(weekDay)的日期   
 */
function getXDate(year,weeks,weekDay){   
    // 用指定的年构造一个日期对象，并将日期设置成这个年的1月1日   
    // 因为计算机中的月份是从0开始的,所以有如下的构造方法   
    var date = new Date(year,"0","1");   
    // 取得这个日期对象 date 的长整形时间 time   
    var time = date.getTime();   
    // 将这个长整形时间加上第N周的时间偏移   
    // 因为第一周就是当前周,所以有:weeks-1,以此类推   
    // 7*24*3600000 是一星期的时间毫秒数,(JS中的日期精确到毫秒)   
    time+=(weeks-1)*7*24*3600000;   
    // 为日期对象 date 重新设置成时间 time   
    date.setTime(time);   
    return getNextDate(date,weekDay);   
}   

/**
 * 这个方法将取得 某日期(nowDate) 所在周的星期几(weekDay)的日期
 */
function getNextDate(nowDate,weekDay){   
    // 0是星期日,1是星期一,...   
    weekDay%=7;   
    var day = nowDate.getDay();
    var time = nowDate.getTime();
    var sub = weekDay-day;
    if(sub < 0){
        sub += 7;
    }
    time+=sub*24*3600000;
    nowDate.setTime(time);   
    return nowDate;   
}  

/**
 * 获取当年第N周
 * @param dateString
 * @returns {String}
 */
function getYearWeek(date){
	if(date == null || date == ''){
		return 0;
	}
	//要计算的日期
	var date1;
    if(typeof date == 'Date' || typeof date == 'object'){
    	date1 = date;
    }else{
    	date1 = new Date(Date.parse(date.replace(/-/g,"/")));
    }
    //1月1号
    var date2 = new Date(date1.getFullYear(), 0, 1);
    //获取1月1号星期（以周一为第一天，0周一~6周日）
    var dateWeekNum=date2.getDay()-1;
	var offset = 0;
	if(dateWeekNum != 0){
		offset = 1;
	}
    if(dateWeekNum<0){
    	dateWeekNum=6;
    }
    if(dateWeekNum<4){
        //前移日期
        date2.setDate(date2.getDate()-dateWeekNum);
    }else{
        //后移日期
        date2.setDate(date2.getDate()+7-dateWeekNum);
    }
    var d = Math.round((date1.valueOf() - date2.valueOf()) / 86400000);
    if(d<0){
        var date3 = (date1.getFullYear()-1)+"-12-31";
        return getYearWeek(date3);
    }else{
        //得到年数周数
//        var year=date1.getFullYear();
        var week=Math.ceil((d+1 )/ 7);
        return Number(week+offset);
    }
}

/**
 * 格式化日期
 */
function getFormatDate(theDate){   
    var day = theDate;   
//    var Year = 0;   
    var Month = 0;   
    var Day = 0;   
    var CurrentDate = "";   
    // 初始化时间   
//    Year= day.getFullYear();// ie火狐下都可以   
    Month= day.getMonth()+1;   
    Day = day.getDate();   
//    CurrentDate += Year + "-";   
    if (Month >= 10) {   
        CurrentDate += Month + "-";   
    } else {   
        CurrentDate += "0" + Month + "-";   
    }   
    if (Day >= 10 ){   
        CurrentDate += Day ;   
    } else {   
        CurrentDate += "0" + Day ;   
    }   
    return CurrentDate;   
}   