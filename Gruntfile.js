/*jshint node:true */
'use strict';

module.exports = function (grunt) {

    // load all grunt tasks
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    grunt.initConfig({

        config: {
            app: 'app',
            dist: 'release'
        },

        clean: {
            dist: {
                files: [{
                    dot: true,
                    src: [
                        '.tmp',
                        '<%= config.dist %>/*',
                        '!<%= config.dist %>/.git*'
                    ]
                }]
            }
        },

        copy: {
            dist: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= config.app %>',
                    dest: '<%= config.dist %>',
                    src: [
                        '**/*.{ico,png,txt,webp,gif,png,jpeg,jpg,html,js}'
                    ]
                }]
            }
        },

        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            all: [
                'Gruntfile.js',
                '<%= config.app %>/scripts/{,*/}*.js',
                '!<%= config.app %>/scripts/vendor/*',
                'test/spec/{,*/}*.js'
            ]
        },

        compass: {
          options: {
            sassDir: '<%= config.app %>/styles',
            cssDir: '<%= config.dist %>/styles',
            generatedImagesDir: '.tmp/images/generated',
            imagesDir: '<%= config.app %>/images',
            javascriptsDir: '<%= config.app %>/scripts',
            fontsDir: '<%= config.app %>/styles/fonts',
            httpImagesPath: '/images',
            httpGeneratedImagesPath: '/images/generated',
            httpFontsPath: '/styles/fonts',
            relativeAssets: false,
            noLineComments: true
          },
          dist: {
            options: {
              generatedImagesDir: '<%= config.dist %>/images/generated'
            }
          },
          server: {
            options: {
              debugInfo: true
            }
          }
        }

    });

    grunt.registerTask('server', [
        'build'
    ]);

    grunt.registerTask('build', [
        'clean:dist',
        'copy:dist',
        'compass:dist'
    ]);

    grunt.registerTask('default', [
        'build'
    ]);

    grunt.registerTask('heroku', [
        'build'
    ]);
};
