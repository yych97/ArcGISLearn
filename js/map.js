$(function () {
    //全选,设置chheckbox name='all' tbody id=tb
    $("input[name=all]").click(function () {
        if (this.checked) {
            $("input[name=layers]").prop("checked", true);
        } else {
            $("input[name=layers]").prop("checked", false);
        }
    });
});

require(["esri/Map", "esri/views/MapView", "esri/layers/MapImageLayer", "dojo/domReady!"], function (Map, MapView, MapImageLayer) {
    var tangLayer = new MapImageLayer({
        url: "http://edugis.rchss.sinica.edu.tw/ArcGIS/rest/services/tsgis_tang/MapServer"
    });
    var map = new Map({
        basemap: "streets"
    });
    map.add(tangLayer);
    var mapview = new MapView({
        map: map,
        container: "map",
        center: [110, 40],
        zoom: 4
    });
});