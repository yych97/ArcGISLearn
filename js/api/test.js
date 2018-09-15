//后台数据接口（根据Vue-router的路由名称以及id获取后台的Json数据）
function getContentByNameAndId(name, id){
    var data_r;
    $.ajax({
        url: "http://106.12.27.212/dotnetcore/api/" + name + "/" + id,
        async: false,
        success: function(data, status){
            data_r = JSON.parse(data);
        }
    });
    return data_r;
}
//后台数据接口（根据Vue-router的路由名称(type)获取后台的Json数据）
function getListByType(type){
    var data_r;
    $.ajax({
        url: "http://106.12.27.212/dotnetcore/api/" + type,
        async: false,
        success: function(data, status){
            data_r = JSON.parse(data);
        }
    });
    return data_r;
}
//统计图表后台数据接口
function getChartData(){
    var data_r;
    $.ajax({
        url: "http://106.12.27.212/dotnetcore/api/statistic",
        async: false,
        success: function(data, status){
            data_r = JSON.parse(data);
        }
    });
    return data_r;
}
//词云图后台数据接口
function getWordCloudDataByPeriodId(id){
    var data_r;
    $.ajax({
        url: "http://106.12.27.212/dotnetcore/api/statistic" + id,
        async: false,
        success: function(data, status){
            data_r = JSON.parse(data);
        }
    });
    return data_r;
}
