//声明全局变量
var map;
var test_layer;
var place_layer;
var mapview;
var highlight_layer;
var period_ImageLayer;

initData = {
    visitor: {
        logined: false,
        username: '',
    },
    point_layer: '诗人',
    base_layer: 'terrain',
    period_layer: 'Empty'
};
mapViewConfig = {
    map: map,
    container: "map",
    center: [110, 40],
    zoom: 4
};
//初始化地图图层信息
require([
    "esri/Map",
    "esri/views/MapView",
    "esri/widgets/Legend",
    "esri/layers/FeatureLayer",
    "esri/layers/GraphicsLayer",
    "esri/layers/MapImageLayer",
    "dojo/domReady!"
], function (
    Map,
    MapView,
    Legend,
    FeatureLayer,
    GraphicsLayer,
    MapImageLayer
) {
    map = new Map({
        basemap: initData.base_layer
    });
    mapview = new MapView({
        map: map,
        container: "map",
        center: mapViewConfig.center,
        zoom: mapViewConfig.zoom
    });
    period_ImageLayer = new MapImageLayer();
    highlight_layer = new GraphicsLayer();
    //实现点击temple中content内容的跳转
    var pTemplate = {
        title: "{place_anci}",
        content: [{
            type: "fields",
            fieldInfos: [{
                fieldName: "place_now"
            }, {
                fieldName: "place_anci"
            }]
        }]
    };
    //在content中添加内容，content是一个数组所以要用push
    pTemplate.content.push({
        type: "text",
        text: "<a href=\"#/place/{placeId}\">点击查看详情</a>"
    });
    place_layer = new FeatureLayer({
        url: "https://trail.arcgisonline.cn/server/rest/services/SYZG/places/MapServer/0",
        popupTemplate: pTemplate
    });
    map.add(place_layer); // 添加地点图层
    //添加图例框
    const legend = new Legend({
        view: mapview,
        container: "legendDiv"
    });
    mapview.ui.add("infoDiv", "top-right");
});


/*其他地图操作函数*/

//加载地图视图函数
function loadMapView() {
    require([
        "esri/layers/MapImageLayer",
        "dojo/domReady!"
    ], function (
        Map,
        MapView,
        Legend,
        MapImageLayer
    ) {
        if (initData.period_layer != "Empty") {
            //添加时期图层
            period_ImageLayer = new MapImageLayer({
                url: "https://trail.arcgisonline.cn/server/rest/services/SYZG/" + initData.period_layer + "/MapServer"
            });
            map.add(period_ImageLayer);
        }
    });
}

//zoomByPlaceId方法
function zoomByPlaceId(id) {
    require([
        "esri/Map",
        "esri/views/MapView",
        "esri/layers/MapImageLayer",
        "esri/layers/FeatureLayer",
        "esri/tasks/support/Query",
        "dojo/domReady!"
    ], function (
        Map,
        MapView,
        MapImageLayer,
        FeatureLayer,
        Query
    ) {
        //服务器端查询
        let query = place_layer.createQuery();
        query.where = "placeId = " + id;
        place_layer.queryFeatures(query).then(function (result) {
            let feature = result.features[0];
            mapViewConfig.center = [feature.geometry.x, feature.geometry.y];
            mapViewConfig.zoom = 10;
            //loadMapView();
            mapview.goTo({
                center: mapViewConfig.center,
                zoom: mapViewConfig.zoom
            });
            highlight (feature.geometry.x, feature.geometry.y);
        })
    });
}

//高亮方法
function highlight (x, y) {
    require([
        "esri/Map",
        "esri/views/MapView",
        "esri/Graphic",
        "esri/layers/GraphicsLayer",
        "dojo/domReady!"
    ], function (
        Map,
        MapView,
        Graphic
    ) {
        var point = {
            type: "point",
            longitude: x,
            latitude: y
        };
        var markerSymbol = {
            type: "simple-marker",
            style: "square",
            color: [0, 0, 0, 0],
            size: 28,
            yoffset: 14,
            outline: {
                color: "blue",
                width: "3px"
            }
        };
        var pointGraphic = new Graphic({
            geometry: point,
            symbol: markerSymbol
        });
        highlight_layer.removeAll();
        highlight_layer.add(pointGraphic);
    });
}

//根据periodId切换时期图层函数
function changePeriodLayerById(id) {
    switch (id) {
        case 0: initData.period_layer = 'Empty'; break;
        case 1: initData.period_layer = 'Chutang'; break;
        case 2: initData.period_layer = 'Shengtang'; break;
        case 3: initData.period_layer = 'Zhongtang'; break;
        case 4: initData.period_layer = 'Wantang'; break;
    }
}

//layerChange事件
function layerChange() {
    require([
        "esri/Map",
        "esri/views/MapView",
        "esri/layers/MapImageLayer",
        "esri/layers/FeatureLayer",
        "dojo/domReady!"
    ], function (
        Map,
        MapView,
        MapImageLayer,
        FeatureLayer
    ) {
        map.basemap = initData.base_layer;
        map.remove(period_ImageLayer);
        map.remove(place_layer);
        map.remove(highlight_layer);
        if (initData.period_layer != "Empty") {
            //添加时期图层
            period_ImageLayer = new MapImageLayer({
                url: "http://trail.arcgisonline.cn/server/rest/services/SYZG/" + initData.period_layer + "/MapServer"
            });
            map.add(period_ImageLayer);
        }
        //map.add(period_ImageLayer);
        map.add(place_layer);
        map.add(highlight_layer);
    });
}
