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
        "esri/geometry/Point",
        "esri/Graphic",
        "esri/layers/FeatureLayer",
        "esri/renderers/HeatmapRenderer",
        "dojo/domReady!"
    ], function (
        Map,
        MapView,
        Point,
        Graphic,
        FeatureLayer,
        HeatmapRenderer
    ) {
        let fields = [
            {
                name: "ObjectID",
                alias: "ObjectID",
                type: "oid"
            }, {
                name: "name",
                alias: "name",
                type: "string"
            }, {
                name: "count",
                alias: "count",
                type: "double"
            }
        ];
        let hrenderer = new HeatmapRenderer({
            //type: "heatmap",
            //field: "count",
            blurRadius: 12,
            colors: [
                { ratio: 0, color: "rgba(255, 255, 255, 0)" },
                { ratio: 0.2, color: "rgba(255, 255, 255, 1)" },
                { ratio: 0.5, color: "rgba(255, 140, 0, 1)" },
                { ratio: 0.8, color: "rgba(255, 140, 0, 1)" },
                { ratio: 1, color: "rgba(255, 0, 0, 1)" }
            ]
            //minPixelIntensity: 2,
            //maxPixelIntensity: 20
        });
        let features = [
            {
                geometry: {
                    type: "point",
                    longitude: 100,
                    latitude: 38
                },
                attributes: {
                    ObjectID: 1,
                    name: "李白",
                    count: 6
                }
            },
            {
                geometry: {
                    type: "point",
                    longitude: 77,
                    latitude: 35
                },
                attributes: {
                    ObjectID: 2,
                    name: "杜甫",
                    count: 20
                }
            },
            {
                geometry: {
                    type: "point",
                    longitude: 100,
                    latitude: 25
                },
                attributes: {
                    ObjectID: 3,
                    name: "白居易",
                    count: 12
                }
            },
            {
                geometry: {
                    type: "point",
                    longitude: 120,
                    latitude: 30
                },
                attributes: {
                    ObjectID: 4,
                    name: "白居易",
                    count: 12
                }
            },
            {
                geometry: {
                    type: "point",
                    longitude: 120,
                    latitude: 45
                },
                attributes: {
                    ObjectID: 5,
                    name: "白居易",
                    count: 12
                }
            },
            {
                geometry: {
                    type: "point",
                    longitude: 130,
                    latitude: 40
                },
                attributes: {
                    ObjectID: 6,
                    name: "白居易",
                    count: 12
                }
            },
            {
                geometry: {
                    type: "point",
                    longitude: 120,
                    latitude: 50
                },
                attributes: {
                    ObjectID: 7,
                    name: "白居易",
                    count: 50
                }
            }
        ];
        heatMap_layer = new FeatureLayer({
            source: features,
            fields: fields,
            objectIdField: "ObjectID",
            renderer: hrenderer,
            spatialReference: {
                wkid: 4326
            },
            geometryType: "point"
        });
        mapview.map = heatmap;
        place_layer.renderer = hrenderer;
        heatmap.add(place_layer);
    });
}
