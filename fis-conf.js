var now = new Date();
fis.config.set('timestamp', [now.getFullYear(), now.getMonth() + 1, now.getDate(), now.getHours(), now.getMinutes()].join(''));

console.log('update time:' + fis.config.get('timestamp'));


fis.config.merge({

    modules: {
        parser: {
            less: ['less']
        },
        //自动将页面中独立的资源引用替换为打包资源
        postpackager: 'simple'
    },

    roadmap: {

        domain: '..',

        ext: {
            less: 'css'
        },

        path: [

            //排除非编译目录
            {
                reg: /\/(protected|themes)\//i,
                release: false
            },

            //排除非编译文件
            {
                reg: /\/(index\.php|.*\.xml|favicon\.ico|conf-[^\.]*\.js)/i,
                release: false
            },
            //只编译dev目录
            {
                reg: /\/public\/(?!dev\/)/i,
                release: false
            },

            {
                reg: /\/public\/dev\/html\/(.*)/i,
                release: '/html/$1'
            },

            {
                reg: /\/public\/dev\/css\/(.*)/i,
                release: '/css/$1'
            },

            {
                reg: /\/public\/dev\/images\/(.*)/i,
                release: '/images/$1',
            },

            {
                reg: /\/public\/dev\/script\/(.*)/i,
                release: '/script/$1'
            },

            {
                reg: /\/public\/dev\/videojs\/(.*)/i,
                release: '/videojs/$1'
            },

            {
                reg: /\/css\/([^\/]+\.png)/i,
                release: '/images/$1',
                query: '?t=${timestamp}'
            }
        ]
    },

    pack: {
        'css/global.min.css': [
            '/public/dev/css/dialog.less',
            '/public/dev/css/nivo-slider.css',
            '/public/dev/css/validation.less'
        ],
        'css/main.min.css': [
            '/public/dev/css/style.less'
        ],
        'script/global.min.js': [
            '/public/dev/script/jquery-1.9.1.min.js',
            '/public/dev/script/jquery.dialog.js',
            '/public/dev/script/jquery.nivo.slider.js',
            '/public/dev/script/jquery.jScroll.js',
            '/public/dev/script/jquery.validationEngine.js',
            '/public/dev/script/jquery.validationEngine-zh_CN.js',
            '/public/dev/script/museum.global.js'
        ],
        'script/videojs.min.js': [
            '/public/dev/videojs/ie8/videojs-ie8.min.js',
            '/public/dev/videojs/video.min.js',
            '/public/dev/videojs/lang/zh-CN.js',
            '/public/dev/script/museum.video.js'
        ],
        'script/index.min.js': [
            '/public/dev/script/museum.index.js'
        ],
        'script/search.min.js': [
            '/public/dev/script/museum.search.js'
        ],
        'script/list.min.js': [
            '/public/dev/script/museum.list.js'
        ],
        'script/detail.min.js': [
            '/public/dev/script/museum.detail.js'
        ],
        'script/login.min.js': [
            '/public/dev/script/museum.login.js'
        ]
    },

    deploy: {
        build: {
            to: './public/build',
            exclude: /.*\.less|\/_sprite\/|nivo-slider\.css|mixins\.css|style\.css|dialog\.css|validation.*|jquery.*|json2\.js|select2.*|museum.*/i
        }
    }
});
