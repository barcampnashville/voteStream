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
                files: ['<%= yeoman.app %>/styles/**/*.css'],
                tasks: []
            },
            compass: {
                files: ['<%= yeoman.app %>/styles/{,*/}*.{scss,sass}'],
                tasks: ['compass:server']
            },
            js: {
                files: ['<%= yeoman.app %>/**/*.js'],
                tasks: []
            },
            html: {
                files: [
                    '<%= yeoman.app %>/**/*.html'
                ],
                tasks: ['preprocess:dist']
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
              port: 9000,
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
                    '.tmp'
                    //yeomanConfig.app,
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
            html: '<%= yeoman.app %>/{,*/}*.html'
        },
        usemin: {
            options: {
              dirs: ['<%= yeoman.dist %>']
            },
            html: ['<%= yeoman.dist %>/{,*/}*.html'],
            css: ['<%= yeoman.dist %>/styles/{,*/}*.css'],
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
        }
    });

    grunt.registerTask('server', function (target) {
        //if (target === 'dist') {
        //    return grunt.task.run(['build', 'connect:dist:keepalive']);
        //}

        grunt.task.run([
            'build',
            //'configureProxies',
            'connect:livereload',
            'watch'
        ]);
    });

    grunt.registerTask('build', [
        'clean:dist',
        'preprocess:dist', // generate html
        'compass:dist',
        'useminPrepare', // prepare usemin tasks
        'concat',
        //'uglify',
        'copy:dist',
        'usemin' // update usemin html references
    ]);

    grunt.registerTask('default', [
        'build'
    ]);

    grunt.registerTask('heroku:production', 'build');

    //grunt.registerTask('heroku', 'server');
};
