initData = {
    visitor: {
        logined: false,
        username: '',
    },
    point_layer: '诗人',
    base_layer: 'terrain',
    period_layer: 'Chutang'
};
mapViewConfig = {
    map: map,
    container: "map",
    center: [110, 40],
    zoom: 4
};

function loadMapView() {
    require(["esri/Map", "esri/views/MapView", "esri/layers/MapImageLayer", "dojo/domReady!"], function (Map, MapView, MapImageLayer) {
        //测试用图层
        let tangLayer = new MapImageLayer({
            url: "http://edugis.rchss.sinica.edu.tw/ArcGIS/rest/services/tsgis_tang/MapServer"
        });
        //时期图
        let period_ImageLayer = new MapImageLayer({
            url: "http://192.168.1.26/arcgis/rest/services/SYZG/" + initData.period_layer + "/MapServer"
        });
        var map = new Map({
            basemap: initData.base_layer
        });
        map.add(period_ImageLayer);
        var mapview = new MapView({
            map: map,
            container: "map",
            center: [110, 40],
            zoom: 4
        });
    });
}

loadMapView();
