require(["esri/Map", "esri/views/MapView", "dojo/domReady!"], function (Map, MapView) {
    var map = new Map({
        basemap: "streets"
    })
    var mapview = new MapView({
        map: map,
        container: "map"
    })
});