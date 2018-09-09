//声明全局变量
var map;
var test_layer;
var place_layer;
var mapview;
var highlight_layer;
var period_ImageLayer;
var heatmap;
var heatMap_layer;

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
function initMapApp() {
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
        // 初始化map与mapview
        map = new Map({
            basemap: initData.base_layer
        });
        heatmap = new Map({
            basemap: "dark-gray"
        });
        mapview = new MapView({
            map: map,
            container: "map",
            center: mapViewConfig.center,
            zoom: mapViewConfig.zoom
        });
        // 初始化各图层
        period_ImageLayer = new MapImageLayer();
        highlight_layer = new GraphicsLayer();
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
        pTemplate.content.push({ // 在content中添加内容，content是一个数组所以要用push
            type: "text",
            text: "<a href=\"#/place/{placeId}\">点击查看详情</a>" // 实现点击temple中content内容的跳转
        });
        place_layer = new FeatureLayer({
            url: "https://trail.arcgisonline.cn/server/rest/services/SYZG/places/MapServer/0",
            popupTemplate: pTemplate
        });
        map.add(place_layer);
        //添加图例框
        const legend = new Legend({
            view: mapview,
            container: "legendDiv"
        });
        mapview.ui.add("infoDiv", "top-right");
    });
}


/*其他地图操作函数*/

//加载地图函数
function loadMap() {
    require([
        "esri/Map",
        "esri/views/MapView",
        "dojo/domReady!"
    ], function (
        Map,
        MapView
    ) {
        mapview.map = map;
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

//加载热力图层

//加载热力图
function loadHeatMap() {
    require([
        "esri/Map",
        "esri/views/MapView",
        "esri/layers/CSVLayer",
        "dojo/domReady!"
    ], function (
        Map,
        MapView,
        CSVLayer,
    ) {
        const renderer = {
            type: "heatmap",
            blurRadius: 15,
            colorStops: [
                { color: "rgba(63, 40, 102, 0)", ratio: 0 },
                { color: "#472b77", ratio: 0.083 },
                { color: "#4e2d87", ratio: 0.166 },
                { color: "#563098", ratio: 0.249 },
                { color: "#5d32a8", ratio: 0.332 },
                { color: "#6735be", ratio: 0.415 },
                { color: "#7139d4", ratio: 0.498 },
                { color: "#7b3ce9", ratio: 0.581 },
                { color: "#853fff", ratio: 0.664 },
                { color: "#a46fbf", ratio: 0.747 },
                { color: "#c29f80", ratio: 0.830 },
                { color: "#e0cf40", ratio: 0.913 },
                { color: "#ffff00", ratio: 1 }
            ],
            maxPixelIntensity: 150,
            minPixelIntensity: 0
        };
        heatMap_layer = new CSVLayer({
            url: "http://localhost:5000/api/heatmap/" + id,
            title: "诗歌分布热力图",
            opacity: 1,
            renderer: renderer
        });
        heatmap.removeAll();
        heatmap.add(heatMap_layer);
        mapview.map = heatmap;
    });
}
