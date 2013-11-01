'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

var modRewrite = require('connect-modrewrite');
//var lrSnippet = require('grunt-contrib-watch/lib/utils').livereloadSnippet;
var proxySnippet = require('grunt-connect-proxy/lib/utils').proxyRequest;

module.exports = function (grunt) {

    require('time-grunt')(grunt); // show elapsed time at the end
    require('load-grunt-tasks')(grunt); // load all grunt tasks

    // configurable paths
    var yeomanConfig = {
        app: 'app',
        dist: 'release'
    };

    grunt.initConfig({
        yeoman: yeomanConfig,
        watch: {
          options: {
            livereload: '<%= connect.options.livereload %>'
          },
            styles: {
                files: ['<%= yeoman.app %>/styles/**/*.{less,css}'],
                tasks: ['less:dist']
            },
            compass: {
                files: ['<%= yeoman.app %>/styles/{,*/}*.{scss,sass}'],
                tasks: ['compass:server']
            },
            js: {
                files: ['<%= yeoman.app %>/**/*.js'],
                tasks: []
            },
            jade: {
                files: [
                    '<%= yeoman.app %>/**/*.{html,jade}'
                ],
                tasks: ['jade', 'preprocess:dist']
            },
          assets: {
                files: [
                    '<%= yeoman.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
                ],
                tasks: []
            },
        },
        connect: {
            options: {
              port: 80,
              livereload: 35729,
              // change this to '0.0.0.0' to access the server from outside
              hostname: '0.0.0.0',
              middleware: function (connect, options) {
                //console.log(lrSnippet);
                var middlewares = [proxySnippet,
                  
                  modRewrite(['!\\.html|\\.js|\\.css|\\.png|\\.svg$ /index.html [L]'])
                ];
                
                if (!Array.isArray(options.base)) {
                  options.base = [options.base];
                }
                options.base.forEach(function(base) {
                  middlewares.push(connect.static(base)); // Serve static files.
                });
                middlewares.push(require('connect-livereload')());
                //middlewares.push(lrSnippet());
                return middlewares;
              },
            },
            proxies: [
          {
            context: '/api',
            host: 'localhost', // you can use localhost...
            port: 3000, // enter your port number here...
            https: false,
            changeOrigin: false
          }
        ],
            livereload: {
                options: {
                    open: true,
                    base: [
                        yeomanConfig.dist,
                        '.tmp',
                        //yeomanConfig.app,
                        ''
                    ]
                }
            }//,
            /*test: {
                options: {
                    base: [
                        '.tmp',
                        'test',
                        yeomanConfig.app,
                    ]
                }
            },
            dist: {
                options: {
                    open: true,
                    base: yeomanConfig.dist
                }
            }*/
        },
        clean: {
            dist: {
                files: [{
                    dot: true,
                    src: [
                        '.tmp',
                        '<%= yeoman.dist %>/*',
                        '!<%= yeoman.dist %>/.git*'
                    ]
                }]
            },
            server: '.tmp'
        },
        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            all: [
                'Gruntfile.js',
                '<%= yeoman.app %>/scripts/{,*/}*.js',
                '!<%= yeoman.app %>/scripts/vendor/*',
                'test/spec/{,*/}*.js'
            ]
        },
        autoprefixer: {
            options: {
                browsers: ['last 1 version']
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.app %>/styles/',
                    src: '{,*/}*.css',
                    dest: '.tmp/styles/'
                }]
            }
        },
        // not used since Uglify task does concat,
        // but still available if needed
        /*concat: {
            dist: {}
        },*/
        'bower-install': {
            app: {
                html: '<%= yeoman.app %>/index.html',
                ignorePath: '<%= yeoman.app %>/'
            }
        },
        // not enabled since usemin task does concat and uglify
        // check index.html to edit your build targets
        // enable this task if you prefer defining your build targets here
        uglify: {
        //    dist: {}
          options: {
            report: 'min',
            mangle: false//{topLevel: false}
          }
        },
        rev: {
            dist: {
                files: {
                    src: [
                        '<%= yeoman.dist %>/scripts/{,*/}*.js',
                        '<%= yeoman.dist %>/styles/{,*/}*.css',
                        '<%= yeoman.dist %>/images/{,*/}*.{png,jpg,jpeg,gif,webp}',
                        '<%= yeoman.dist %>/styles/fonts/{,*/}*.*'
                    ]
                }
            }
        },
        less: {
          dist: {
            files: {
              '<%= yeoman.dist %>/styles/style.css': '<%= yeoman.app %>/styles/style.less'
            }
          }
        },
        compass: {
          options: {
            sassDir: '<%= yeoman.app %>/styles',
            cssDir: '<%= yeoman.dist %>/styles',
            generatedImagesDir: '.tmp/images/generated',
            imagesDir: '<%= yeoman.app %>/images',
            javascriptsDir: '<%= yeoman.app %>/scripts',
            fontsDir: '<%= yeoman.app %>/styles/fonts',
            //importPath: '/bower_components',
            httpImagesPath: '/images',
            httpGeneratedImagesPath: '/images/generated',
            httpFontsPath: '/styles/fonts',
            relativeAssets: false,
            noLineComments: true
          },
          dist: {
            options: {
              generatedImagesDir: '<%= yeoman.dist %>/images/generated'
            }
          },
          server: {
            options: {
              debugInfo: true
            }
          }
        },
        preprocess : {
          dev : {
            options : {
              context:{env:'development'}
            },
            files : {
              '<%= yeoman.dist %>/index.html':'<%= yeoman.app %>/index.html',
                '<%= yeoman.dist %>/templates/sessionlist.html':'<%= yeoman.app %>/templates/sessionlist.html',
                '<%= yeoman.dist %>/templates/*.html':'<%= yeoman.app %>/templates/*.html',
            }
          },
          dist : {
            options : {
              context:{env:'production'}
            },
            files : {
                '<%= yeoman.dist %>/index.html':'<%= yeoman.app %>/index.html',
                '<%= yeoman.dist %>/templates/sessionlist.html':'<%= yeoman.app %>/templates/sessionlist.html',
                '<%= yeoman.dist %>/templates/results.html':'<%= yeoman.app %>/templates/results.html',
                '<%= yeoman.dist %>/templates/signin.html':'<%= yeoman.app %>/templates/signin.html'
            }
          }
        },
        useminPrepare: {
            options: {
                dest: '<%= yeoman.dist %>'
            },
            html: '<%= yeoman.app %>/index.html'
        },
        usemin: {
            options: {
              dirs: ['<%= yeoman.dist %>']
            },
            html: ['<%= yeoman.dist %>/{,*/}*.html'],
            css: ['<%= yeoman.dist %>/styles/{,*/}*.css'],
            //js: ['<%= yeoman.app %>/{,*/}*.js']
        },
        imagemin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.app %>/images',
                    src: '{,*/}*.{png,jpg,jpeg}',
                    dest: '<%= yeoman.dist %>/images'
                }]
            }
        },
        svgmin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.app %>/images',
                    src: '{,*/}*.svg',
                    dest: '<%= yeoman.dist %>/images'
                }]
            }
        },
        cssmin: {
            // This task is pre-configured if you do not wish to use Usemin
            // blocks for your CSS. By default, the Usemin block from your
            // `index.html` will take care of minification, e.g.
            //
            //     <!-- build:css({.tmp,app}) styles/main.css -->
            //
            // dist: {
            //     files: {
            //         '<%= yeoman.dist %>/styles/main.css': [
            //             '.tmp/styles/{,*/}*.css',
            //             '<%= yeoman.app %>/styles/{,*/}*.css'
            //         ]
            //     }
            // }
        },
        htmlmin: {
            dist: {
                options: {
                    removeComments: true,
                    // https://github.com/yeoman/grunt-usemin/issues/44
                    collapseWhitespace: true,
                    collapseBooleanAttributes: true,
                    //removeAttributeQuotes: true,
                    removeRedundantAttributes: true,
                    //useShortDoctype: true,
                    removeEmptyAttributes: true,
                    removeOptionalTags: true
                },
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.dist %>',
                    src: '*.html',
                    dest: '<%= yeoman.dist %>'
                }]
            }
        },
        // Put files not handled in other tasks here
        copy: {
            dist: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= yeoman.app %>',
                    dest: '<%= yeoman.dist %>',
                    src: [
                        '*.{ico,png,txt}',
                        '.htaccess',
                        'images/{,*/}*.{webp,gif,png,jpeg,jpg}',
                        //'styles/fonts/{,*/}*.*',
                        //'bower_components/sass-bootstrap/fonts/*.*',
                        //'styles/{,*/}*.css',
                        'templates/{,*/}*.html'
                    ]
                }]
            },
            //styles: {
            //    expand: true,
            //    dot: true,
            //    cwd: '<%= yeoman.app %>/styles',
            //    dest: '.tmp/styles/',
            //    src: '{,*/}*.css'
            //}
        },
        modernizr: {
            devFile: '<%= yeoman.app %>/bower_components/modernizr/modernizr.js',
            outputFile: '<%= yeoman.dist %>/bower_components/modernizr/modernizr.js',
            files: [
                '<%= yeoman.dist %>/scripts/{,*/}*.js',
                '<%= yeoman.dist %>/styles/{,*/}*.css',
                '!<%= yeoman.dist %>/scripts/vendor/*'
            ],
            uglify: true
        },
        concurrent: {
            min: [
                //'copy:styles',
                //'imagemin',
                'svgmin',
            ]
        },
        jade: {
          compile: {
            options: {
                pretty: true
            },
            files: [
              {
                    expand: true,
                    cwd: '<%= yeoman.app %>',
                    src: '**/*.jade', //['{,*/}*.jade','templates/{,*/}*.jade'],
                    dest: 'release',
                    ext: '.html'
                }
            ]
        }
    }
    });

    grunt.registerTask('server', function (target) {
        //if (target === 'dist') {
        //    return grunt.task.run(['build', 'connect:dist:keepalive']);
        //}

        grunt.task.run([
            'build',
            'configureProxies',
            //'connect:livereload',
            'watch'
        ]);
    });

    grunt.registerTask('build', [
        'clean:dist',
        'preprocess:dist', // generate html
        'compass:dist',
        //'less:dist',
        'concurrent:min', // copy and minify assets
        //'autoprefixer', // autoprefix css to .tmp
        'jade',
        //'useminPrepare', // prepare usemin tasks
        //'concat',
        //'cssmin', // minify css from .tmp to release
        //'uglify',
        /*'modernizr',*/
        'copy:dist',
        /*'rev',*/
        //'usemin', // update usemin html references
        //'htmlmin' // minify html in place
    ]);

    grunt.registerTask('default', [
        'jshint',
        'build'
    ]);

    grunt.registerTask('heroku', 'grunt server');
};
