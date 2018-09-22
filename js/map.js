//声明全局变量
var mapview;
var map; //普通图
var heatmap; //热力图
var roadmap; //诗人轨迹图
var place_layer;
var highlight_layer;
var period_ImageLayer;
var place_ImageLayer;
var heatMap_layer;
var road_layer;
var serviceUrl = 'http://106.12.27.212/dotnetcore/';

var initData = {
    point_layer: '诗人',
    base_layer: 'streets',
    period_layer: 'Empty'
};
var mapViewConfig = {
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
            basemap: initData.base_layer,
            showLabels : true
        });
        heatmap = new Map({
            basemap: "streets"
        });
        roadmap = new Map({
            basemap: "streets"
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
        let pTemplate = {
            title: "{place_anci}",
            content: [{
                type: "text",
                text: "<p>现地名：{place_now}</p>" +
                    "<p>古地名：{place_anci}</p>"
            }]
        };
        pTemplate.content.push({ // 在content中添加内容，content是一个数组所以要用push
            type: "text",
            text: "<a href='#/place/{placeId}' style='float: right'>点击查看详情</a>" // 实现点击temple中content内容的跳转
        });
        place_layer = new FeatureLayer({
            url: "https://trail.arcgisonline.cn/server/rest/services/SYZG/places/MapServer/0",
            popupTemplate: pTemplate
        });
        place_ImageLayer = new MapImageLayer({
            url: "https://trail.arcgisonline.cn/server/rest/services/SYZG/places/MapServer"
        });
        map.add(place_layer);
        map.add(place_ImageLayer);
        //添加图例框
        const legend = new Legend({
            view: mapview,
            container: "legendDiv"
        });
        mapview.ui.add("infoDiv", "bottom-right");
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
        if(mapview != null){
            mapview.map = map;
            mapview.ui.empty("bottom-left");
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
        if(place_layer != null){
            //服务器端查询
            let query = place_layer.createQuery();
            query.where = "placeId = " + id;
            place_layer.queryFeatures(query).then(function (result) {
                let feature = result.features[0];
                mapViewConfig.center = [feature.geometry.x, feature.geometry.y];
                mapViewConfig.zoom = 9;
                //loadMapView();
                mapview.popup.close();
                mapview.goTo({
                    center: mapViewConfig.center,
                    zoom: mapViewConfig.zoom
                });
                highlight (feature.geometry.x, feature.geometry.y);
            })
        }
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
            size: 16,
            yoffset: 0,
            outline: {
                color: [86, 254, 254, 1],
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
        if(map != null){
            map.basemap = initData.base_layer;
            map.remove(period_ImageLayer);
            map.remove(place_layer);
            map.remove(place_ImageLayer);
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
            map.add(place_ImageLayer);
            map.add(highlight_layer);
        }
    });
}

//加载热力图
function loadHeatMapByPeriodId(id) {
    require([
        "esri/Map",
        "esri/views/MapView",
        "esri/layers/CSVLayer",
        "esri/widgets/Legend",
        "dojo/domReady!"
    ], function (
        Map,
        MapView,
        CSVLayer,
        Legend
    ) {
        const renderer = {
            type: "heatmap",
            blurRadius: 15,
            colorStops: [
                { color: "rgba(254, 251, 179, 0)", ratio: 0 },//透明
                { color: "#fefbb3", ratio: 0.1 },
                { color: "#fef182", ratio: 0.2 },
                { color: "#fee670", ratio: 0.3 },
                { color: "#fed378", ratio: 0.4 },
                { color: "#fec569", ratio: 0.5 },
                { color: "#feb54e", ratio: 0.6 },
                { color: "#fea534", ratio: 0.7 },
                { color: "#fe941e", ratio: 0.8 },
                { color: "#fe9100", ratio: 0.9 },
                { color: "#fe7b00", ratio: 1 }
            ],
            maxPixelIntensity: 140,
            minPixelIntensity: 0
        };
        heatMap_layer = new CSVLayer({
            url: serviceUrl + "api/heatmap/" + id,
            title: "唐诗三百首分布热力图",
            opacity: 0.65,
            renderer: renderer
        });
        heatmap.removeAll();
        heatmap.add(heatMap_layer);
        mapview.map = heatmap;
        changePeriodLayerById(parseInt(id)); //需要将路由中的string型id转化为int型
        // 添加图例
        mapview.ui.empty("bottom-left");
        mapview.ui.add(new Legend({
            view: mapview
        }), "bottom-left");
    });
}

//加载诗人轨迹图函数
function loadRoadMapById(id) {
    require([
        "esri/Map",
        "esri/views/MapView",
        "esri/layers/FeatureLayer",
        "esri/layers/MapImageLayer",
        "esri/widgets/Legend",
        "esri/tasks/support/Query",
        "dojo/domReady!"
    ], function (
        Map,
        MapView,
        FeatureLayer,
        MapImageLayer,
        Legend,
        Query
    ) {
        if(mapview != null){
            mapview.map = roadmap;
            roadmap.removeAll();
            period_ImageLayer = new MapImageLayer({
                title: "盛唐行省图",
                legendEnabled: false,
                url: "http://trail.arcgisonline.cn/server/rest/services/SYZG/Shengtang/MapServer"
            });
            roadmap.add(period_ImageLayer);
            //加城市点
            let pTemplate = {
                title: "{cityname}",
                content: "<p>年份：{year_}</p>" +
                    "<p>年龄：{age}</p>" +
                    "<p>事件：{remark}</p>"
            };
            road_layer = new FeatureLayer({
                title: "城市",
                legendEnabled: false,
                url: "https://trail.arcgisonline.cn/server/rest/services/SYZG/" + id + "/MapServer/0",
                popupTemplate: pTemplate
            })
            roadmap.add(road_layer);
            //加标注
            road_layer = new MapImageLayer({
                legendEnabled: false,
                url: "https://trail.arcgisonline.cn/server/rest/services/SYZG/" + id + "/MapServer"
            })
            roadmap.add(road_layer);
            //加路线
            pTemplate = {
                title: "{StartEndCity}",
                content: "<p>{mood}</p><" +
                    "<p>公元{RoadTime}</p>"
            };
            road_layer = new FeatureLayer({
                title: "诗人轨迹",
                url: "https://trail.arcgisonline.cn/server/rest/services/SYZG/" + id + "/MapServer/2",
                popupTemplate: pTemplate
            })
            roadmap.add(road_layer);
            //缩放至
            mapview.goTo({
                center: [110, 35],
                zoom: 5
            });
            mapview.ui.empty("bottom-left");
            mapview.ui.add(new Legend({
                view: mapview
            }), "bottom-left");

            //查询添加列表
            const listNode = document.getElementById("road_graphics");
            var query = road_layer.createQuery();
            query.where = "id <> 0";
            road_layer.queryFeatures(query).then(function(results) {
                graphics = results.features;
                const fragment = document.createDocumentFragment();

                graphics.forEach(function(result, index) {
                    const attributes = result.attributes;
                    //const name = index + ": " + attributes.StartEndCity; //带序号
                    const name = "公元" + attributes.RoadTime + " " + attributes.StartEndCity;

                    // Create a list zip codes in NY
                    const ul = document.createElement("ul");
                    ul.classList.add('list-group-item');
                    ul.classList.add('transparent');
                    const li = document.createElement("li");
                    li.tabIndex = 0;
                    li.classList.add('item');
                    const a = document.createElement("a");
                    a.setAttribute("data-result-id", index);
                    a.setAttribute('href', '#');
                    a.textContent = name;
                    li.appendChild(a);
                    ul.appendChild(li);
                    fragment.appendChild(ul);
                });
                // Empty the current list
                listNode.innerHTML = "";
                listNode.appendChild(fragment);
            }).catch(function(error) {
                console.error("query failed: ", error);
            });
            //添加点击跳转事件
            function onListClickHandler(event) {
                const target = event.target;
                const resultId = target.getAttribute("data-result-id");
                const result = resultId && graphics && graphics[parseInt(resultId, 10)];
                if (result) {
                    mapview.goTo(result.geometry.extent.expand(2));
                    // .then(function() {
                    //     mapview.popup.open({
                    //         features: [result],
                    //         location: result.geometry.centroid
                    //     });
                    // });
                }
            }
            listNode.addEventListener("click", onListClickHandler);
        }
    });
}
