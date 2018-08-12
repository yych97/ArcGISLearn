require(["esri/Map", "esri/views/MapView", "dojo/domReady!"], function(Map, MapView) {
    //var basemap = 'streets';
    var wm = new Vue({
        el: '#app',
        data:{
            foodlist: [
                {
                    name: '鱼',
                    price: 10,
                    discount: .8
                },
                {
                    name: '虾',
                    price: 10,
                    discount: .5
                },
                {
                    name: '肉',
                    price: 10,
                    discount: null
                }
            ],
            class1: false,
            ok: true,
            message: 'RUNOOB',
            id : 1,
            seen: true,
            sex: 'female'
        },
        methods: {
            reverseMessage: function () {
                this.message = this.message.split('').reverse().join('')
            }
        }
    });
});