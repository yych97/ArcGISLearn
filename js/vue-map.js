// 模板定义在HTML中

// 定义诗人(路由) 组件。
const poet = {
    template: '#poet-template',
    data: function () {
        return {
            poet: getContentByNameAndId(this.$route.name, this.$route.params.id)
        };
    },
    methods: {
        getInfoByPoetId: function () {
            alert(this.$route.params.id);
        },
        getContent: function () {
            this.$data.poet = getContentByNameAndId(this.$route.name, this.$route.params.id);
        }
    },
    mounted: function () {
        loadMap();
        changePeriodLayerById(this.$data.poet.periodId);
        zoomByPlaceId(this.$data.poet.placeId);
        layerChange();
    },
    watch: {
        '$route': function() {
            this.getContent();
            changePeriodLayerById(this.$data.poet.periodId);
            zoomByPlaceId(this.$data.poet.placeId); //改变mapviewconfig中参数同时重新加载mapview
        }
    }
};
// 定义诗歌(路由) 组件。
const poem = {
    template: '#poem-template',
    data: function () {
        return {
            poem: getContentByNameAndId(this.$route.name, this.$route.params.id)
        };
    },
    methods: {
        getInfoByPoemId: function () {
            alert(this.$route.params.id);
        },
        getContent: function () {
            this.$data.poem = getContentByNameAndId(this.$route.name, this.$route.params.id);
        }
    },
    mounted: function(){
        loadMap();
        changePeriodLayerById(this.$data.poem.periodId); // 切换时期图层
        zoomByPlaceId(this.$data.poem.placeId);
        layerChange();
    },
    watch: {
        '$route': function() {
            this.getContent();
            changePeriodLayerById(this.$data.poem.periodId); // 切换时期图层
            zoomByPlaceId(this.$data.poem.placeId);
        }
    }
};
// 定义地点(路由) 组件。
const place = {
    template: '#place-template',
    data: function () {
        return {
            place: getContentByNameAndId(this.$route.name, this.$route.params.id)
        };
    },
    methods: {
        getInfoByPlaceId: function () {
            alert(this.$route.params.id);
        },
        getContent: function () {
            this.$data.place = getContentByNameAndId(this.$route.name, this.$route.params.id);
        }
    },
    mounted: function(){
        loadMap();
        changePeriodLayerById(0);
        zoomByPlaceId(this.$data.place.placeId);
        layerChange();
    },
    watch: {
        '$route': function() {
            this.getContent();
            zoomByPlaceId(this.$data.place.placeId);
        }
    }
};
// 定义首页(路由) 组件。
const home = {
    template: '#home-template',
    data: function () {
        return {};
    },
    methods: {},
    mounted: function(){
        loadMap();
        layerChange();
    }
};
// 定义列表(路由) 组件。
const list = {
    template: '#list-template',
    data: function () {
        return {
            list: getListByType(this.$route.params.type)
        };
    },
    methods: {
        getListByType: function () {
            alert(this.$route.params.id);
        },
        getContent: function () {
            this.$data.list = getListByType(this.$route.params.type);
        }
    },
    mounted: function(){
        loadMap();
        changePeriodLayerById(0);
        layerChange();
    },
    watch: {
        '$route': 'getContent'
    }
};
// 定义热力图(路由) 组件。
const heatMap = {
    template: '#heatMap-template',
    data: function () {
        return {};
    },
    methods: {},
    mounted: function(){
        loadHeatMap();
    }
};

// 创建 router 实例
const router = new VueRouter({
    routes: [
        // 动态路径参数 以冒号开头
        {path: '/poet/:id', name: 'poet', component: poet},
        {path: '/poem/:id', name: 'poem', component: poem},
        {path: '/place/:id', name: 'place', component: place},
        {path: '/list/:type', name: 'list', component: list},
        {path: '/heatMap/:id', name: 'heatMap', component: heatMap},
        {path: '/', name: 'home', component: home}
    ]
});

var vm = new Vue({
    el: '#app',
    data: initData,
    methods: {},
    watch: {
        // 如果 `base_layer` 发生改变，这个函数就会运行
        base_layer: function () {
            layerChange();
        },
        // 如果 `period_layer` 发生改变，这个函数就会运行
        period_layer: function () {
            layerChange()
        }
    },
    router: router
}).$mount('#app');
