// 定义模板（最好在HTML中定义）
const authorTemplate = ``;

//定义数据
const libai = {
    poet: {
        name: '李白',
        biechen: '李十二、李翰林 、李供奉、李拾遗、诗仙',
        hao: '字太白、号青莲居士，又号谪仙人',
        birth: '701年（长安元年）',
        death: '762年（宝应元年）',
        home: '绵州昌隆县（今四川省江油市）',
        descriptions: [
            '是唐代伟大的浪漫主义诗人，被后人誉为“诗仙”。' +
            '与杜甫并称为“李杜”，为了与另两位诗人李商隐与杜牧即“小李杜”区别，杜甫与李白又合称“大李杜”。' +
            '其人爽朗大方，爱饮酒作诗，喜交友。',
            '李白有《李太白集》传世，诗作中多以醉时写的，' +
            '代表作有《望庐山瀑布》、《行路难》、《蜀道难》、《将进酒》、《越女词》、《早发白帝城》等多首。',
            '李白所作词赋，宋人已有传记（如文莹《湘山野录》卷上），就其开创意义及艺术成就而言，“李白词”享有极为崇高的地位。'
        ],
        baikelink: 'https://baike.so.com/doc/5340576-5576019.html',
        comments: [
            {
                username: 'shq',
                content: '唐天宝年间，汪伦听说大诗人李白旅居南陵叔父李冰阳家，便写信邀请李白到家中做客。' +
                    '信上说：“先生好游乎？此处有十里桃花。先生好饮乎？此处有万家酒店。”' +
                    '李白素好饮酒，又闻有如此美景，欣然应邀而至，却未见信中所言盛景。' +
                    '汪伦盛情款待，搬出用桃花潭水酿成的美酒与李白同饮，并笑着告诉李白：“桃花者，十里外潭水名也，并无十里桃花。' +
                    '万家者，开酒店的主人姓万，并非有万家酒店。”' +
                    '李白听后大笑不止，并不以为被愚弄，反而被汪伦的盛情所感动，适逢春风桃李花开日，群山无处不飞红，' +
                    '加之潭水深碧，清澈晶莹，翠峦倒映，汪伦留李白连住数日，每日以美酒相待，别时送名马八匹、官锦十端。' +
                    '李白在东园古渡乘舟欲往万村，登旱路去庐山，汪伦在古岸阁上设宴为李白饯行，并拍手踏脚，歌唱民间的《踏歌》相送。' +
                    '李白深深感激汪伦的盛意，作《赠汪伦》诗一首： 李白乘舟将欲行，忽闻岸上踏歌声。 桃花潭水深千尺，不及汪伦送我情。'
            },
            {
                username: 'lyy',
                content: '李白离开东鲁，便从任城乘船，沿运河到了润州。由于急着去会稽会见元丹丘，也就没有多滞留。' +
                    '到了会稽，李白首先去凭吊过世的贺知章。不久，孔巢父也到了会稽，于是李白和元丹丘、孔巢父畅游禹穴、兰亭等历史遗迹，' +
                    '泛舟镜湖，往来剡溪等处，当然也少不了在繁华都市会稽流连忘返。'
            }
        ]
    }
};

// 定义诗人(路由) 组件。
const Poet = {
    template: '#poet-template',
    data: function () {
        return libai;
    },
    methods:{
        getInfoByPoetId: function(){
            alert(this.$route.params.id);
        }
    }
};

// 定义诗歌(路由) 组件。
const Poem = {
    template: '#poem-template',
    data: function () {
        return libai;
    },
    methods:{
        getInfoByPoetId: function(){
            alert(this.$route.params.id);
        }
    }
};

// 创建 router 实例
const router = new VueRouter({
    routes: [
        // 动态路径参数 以冒号开头
        { path: '/poet/:id', component: Poet },
        { path: '/poem/:id', component: Poem }
    ]
});

var wm = new Vue({
    el: '#app',
    data: {
        visitor: {
            logined: false,
            username: '',
        }
    },
    router: router
}).$mount('#app');