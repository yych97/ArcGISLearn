//后台数据接口（根据Vue-router的路由名称以及id获取后台的Json数据）
function getContentByNameAndId(name, id){
    var data_r;
    $.ajax({ 
        url: "http://localhost:5000/api/" + name + "/" + id,
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
        url: "http://localhost:5000/api/" + type,
        async: false,
        success: function(data, status){
            data_r = JSON.parse(data);            
        }
    });
    return data_r;    
}