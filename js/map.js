var map;
var test_layer;
var place_layer;
var mapview;
var highlight;
var highlight_layer;
var onClick;
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
require([
    "esri/Map",
    "esri/views/MapView",
    "esri/layers/FeatureLayer",
    "esri/layers/GraphicsLayer",
    "esri/symbols/SimpleMarkerSymbol",
    "esri/symbols/PictureMarkerSymbol",
    "esri/Graphic",
    "dojo/domReady!"
], function (
    Map,
    MapView,
    FeatureLayer,
    GraphicsLayer,
    SimpleMarkerSymbol,
    PictureMarkerSymbol,
    Graphic
) {
    //简单样式
    var symbol = {
        type: "simple-marker",  // autocasts as new SimpleMarkerSymbol()
        style: "square",
        color: "blue",
        size: "8px",  // pixels
        outline: {  // autocasts as new SimpleLineSymbol()
            color: [255, 255, 0],
            width: 3  // points
        }
    };
    //图片标注
    symbol = {
        type: "picture-marker",  // autocasts as new PictureMarkerSymbol()
        url: "https://webapps-cdn.esri.com/Apps/MegaMenu/img/logo.jpg",
        width: "50px",
        height: "25px"
    };
    var features = [
        {
            geometry: {
                type: "point",
                longitude: 100,
                latitude: 38
            },
            symbol: symbol,
            attributes: {
                ObjectID: 1,
                Name: "李白",
                Type: "poet"
            }
        },
        {
            geometry: {
                type: "point",
                longitude: 77,
                latitude: 35
            },
            symbol: symbol,
            attributes: {
                ObjectID: 2,
                Name: "杜甫",
                Type: "poet"
            }
        },
        {
            geometry: {
                type: "point",
                longitude: 120,
                latitude: 40
            },
            symbol: symbol,
            attributes: {
                ObjectID: 3,
                Name: "白居易",
                Type: "poet"
            }
        }
    ];
    var fields = [
        {
            name: "ObjectID",
            alias: "ObjectID",
            type: "oid"
        }, {
            name: "Name",
            alias: "Name",
            type: "string"
        }, {
            name: "Type",
            alias: "Type",
            type: "string"
        }
    ];
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
    test_layer = new FeatureLayer({
        source: features, // autocast as an array of esri/Graphic
        // create an instance of esri/layers/support/Field for each field object
        fields: fields, // This is required when creating a layer from Graphics
        objectIdField: "ObjectID", // This must be defined when creating a layer from Graphics
        spatialReference: {
            wkid: 4326
        },
        geometryType: "point" // Must be set when creating a layer from Graphics
        //popupTemplate: pTemplate
    });
    place_layer = new FeatureLayer({
        url: "http://192.168.1.26/arcgis/rest/services/SYZG/places/MapServer/0",
        popupTemplate: pTemplate
    })
    highlight_layer = new GraphicsLayer();
});

//加载地图视图方法
function loadMapView() {
    require([
        "esri/Map",
        "esri/views/MapView",
        "esri/layers/MapImageLayer",
        "dojo/domReady!"
    ], function (
        Map,
        MapView,
        MapImageLayer
    ) {
        //测试用图层
        let tangLayer = new MapImageLayer({
            url: "http://edugis.rchss.sinica.edu.tw/ArcGIS/rest/services/tsgis_tang/MapServer"
        });
        map = new Map({
            basemap: initData.base_layer
        });
        if (initData.period_layer != "Empty") {
            //添加时期图层
            let period_ImageLayer = new MapImageLayer({
                url: "http://192.168.1.26/arcgis/rest/services/SYZG/" + initData.period_layer + "/MapServer"
            });
            map.add(period_ImageLayer);
        }
        mapview = new MapView({
            map: map,
            container: "map",
            center: mapViewConfig.center,
            zoom: mapViewConfig.zoom,
            highlightOptions: {
                color: [255, 255, 0, 1],
                haloOpacity: 0.9,
                fillOpacity: 0.2
            }
        });
        //map.add(test_layer); //测试图层
        map.add(place_layer); //地点图层
        map.add(highlight_layer); //高亮图层
        // if( id != null ){
        //     zoomByPlaceId(id);
        // }
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
        //客户端查询仅支持featurelayerView与query,不支持featurelayer的查询方法
        // var highlight;
        // var query = new Query();
        // query.objectIds = [1];
        // // returns all the Ids from the graphics in the layer view
        // mapview.whenLayerView(test_layer).then(function(layerView){
        //     return layerView.queryObjectIds(query)
        // }).then(function(ids){
        //     console.log(ids);  // prints the ids of all the client-side graphics to the console
        //     highlight = layerView.highlight(ids);
        // });
        //服务器端查询
        mapview.when(function(){ //待mapview生成后执行
            mapview.whenLayerView(place_layer).then(function (layerView) {
                let query = place_layer.createQuery();
                query.where = "placeId = " + id;
                place_layer.queryFeatures(query).then(function (result) {
                    let feature = result.features[0];
                    //console.log(feature);
                    // mapview.goTo({
                    //     target: feature.geometry,
                    //     zoom: 12
                    // });
                    mapViewConfig.center = [feature.geometry.x, feature.geometry.y];
                    mapViewConfig.zoom = 8;
                    //loadMapView();
                })
            });
        });
    });
}

//通过graphiclsyer不同于featurelayer的样式实现高亮
//highlight_layer.add(feature);

function changePeriodLayerById(id) {
    switch (id) {
        case 0: initData.period_layer = 'Empty'; break;
        case 1: initData.period_layer = 'Chutang'; break;
        case 2: initData.period_layer = 'Shengtang'; break;
        case 3: initData.period_layer = 'Zhongtang'; break;
        case 4: initData.period_layer = 'Wantang'; break;
    }
}

