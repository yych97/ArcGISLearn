initData = {
    visitor: {
        logined: false,
        username: '',
    },
    point_layer: '诗人',
    base_layer: 'terrain',
    period_layer: '初唐'
};
mapViewConfig = {
    map: map,
    container: "map",
    center: [110, 40],
    zoom: 4
};

function loadMapView() {
    require(["esri/Map", "esri/views/MapView", "esri/layers/MapImageLayer", "dojo/domReady!"], function (Map, MapView, MapImageLayer) {
        var tangLayer = new MapImageLayer({
            url: "http://edugis.rchss.sinica.edu.tw/ArcGIS/rest/services/tsgis_tang/MapServer"
        });
        var map = new Map({
            basemap: initData.base_layer
        });
        map.add(tangLayer);
        var mapview = new MapView({
            map: map,
            container: "map",
            center: [110, 40],
            zoom: 4
        });
    });
}

loadMapView();