// $(function () {
//     //全选,设置chheckbox name='all' tbody id=tb
//     $("input[name=all]").click(function () {
//         if (this.checked) {
//             $("input[name=time]").prop("checked", true);
//         } else {
//             $("input[name=time]").prop("checked", false);
//         }
//     });
//     $("input[name=time-layers]").click(function(){
//         $("input[name=time-layers]").prop("checked", false); //设置当前选中的checkbox同级(兄弟级)其他checkbox状态为未选中
//         $(this).prop("checked", true);//设置当前选中checkbox的状态为checked
//     });
//     $("input[name=type-layers]").click(function(){
//         $("input[name=type-layers]").prop("checked", false); //设置当前选中的checkbox同级(兄弟级)其他checkbox状态为未选中
//         $(this).prop("checked", true);//设置当前选中checkbox的状态为checked
//     });
// });

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