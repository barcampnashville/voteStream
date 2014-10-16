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

        watch: {
            html: {
                files: ['<%= config.app %>/{,**/}*.html'],
                tasks: ['build']
            },
            js: {
                files: ['<%= config.app %>/scripts/{,**/}*.js'],
                tasks: ['build']
            },
            css: {
            files: ['<%= config.app %>/styles/{,**/}*.css'],
                tasks: ['build']
            }
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
                        '**/*.{ico,png,txt,webp,gif,png,jpeg,jpg,html,js,css}'
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
        }

    });

    grunt.registerTask('dev', [
        'build',
        'watch'
    ]);

    grunt.registerTask('build', [
        'clean:dist',
        'copy:dist',
        // probably should have something to process here...
    ]);

    grunt.registerTask('default', [
        'build'
    ]);

    grunt.registerTask('heroku', [
        'build'
    ]);
};
