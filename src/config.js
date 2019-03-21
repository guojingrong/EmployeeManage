var config = {
    token:"eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI1Yjk1MmM3MTQ0NzIxMWU5OGM5NGU4NmE2NDVkZDk1NSIsInBhc3N3b3JkIjoiMXEydzNlNHIiLCJyb2xlIjoiMTAwOSIsImlzcyI6InljZ3VvIiwiZXhwIjoxNTU0NTU5MzAwLCJpYXQiOjE1NTMwODgwNzIsImp0aSI6ImUyMmFkNzdlLTE4YmQtNDVmNC1hNjlkLTQwMjc1NzM5MmUyMiIsInVzZXJuYW1lIjoieWNndW8ifQ.N25NyFYw02AAskjeL_PwInkgeWhPY1E3MkXv1TGIabM",
    url: {
        local: "/lapi",
        server: "/sapi"
    },
    trim: function () {
        return str.replace(/^\s+|\s+$/gm, '');
    },
    //格式化时间戳
    timestampformat: function (fmt, timestamp) {
        var date = new Date(timestamp);
        // date.setTime(timestamp* 1000);// * 1000
        // console.log(date)
        var o = {
            "M+": date.getMonth() + 1, //月份   
            "d+": date.getDate(), //日   
            "h+": date.getHours(), //小时   
            "m+": date.getMinutes(), //分   
            "s+": date.getSeconds(), //秒   
            "q+": Math.floor((date.getMonth() + 3) / 3), //季度   
            "S": date.getMilliseconds() //毫秒   
        };
        if (/(y+)/.test(fmt))
            fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt))
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    },
    //格式化Fri Sep 28 2018 00:00:00 GMT+0800 (中国标准时间) 
    dateformat: function (fmt, d) {
        var date = new Date(d);
        var o = {
            "M+": date.getMonth() + 1, //月份   
            "d+": date.getDate(), //日   
            "h+": date.getHours(), //小时   
            "m+": date.getMinutes(), //分   
            "s+": date.getSeconds(), //秒   
            "q+": Math.floor((date.getMonth() + 3) / 3), //季度   
            "S": date.getMilliseconds() //毫秒   
        };
        if (/(y+)/.test(fmt))
            fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt))
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    },
    getAge(birth) {
        var birthArr = birth.split("-");
        var d = new Date();
        var yearDiff = d.getFullYear() - birthArr[0];
        var monthDiff = d.getMonth() + 1 - birthArr[1];
        var dayDiff = d.getDate() - birthArr[2];
        var age = monthDiff < 0 || (monthDiff == 0 && dayDiff < 0) ? yearDiff - 1 : yearDiff; //判断有没有到生日,没到就减1
        return age = age < 0 ? 0 : age;
    }
}

export default config;