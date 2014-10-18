/*jshint node:true */
'use strict';

module.exports = function (grunt) {

	// load all grunt tasks
	require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

	grunt.initConfig({

		config: {
			app: 'app',
			dist: 'release',
			tmp: '.tmp'
		},

		watch: {
			// html: {
			// 	files: ['<%= config.app %>/{,**/}*.html'],
			// 	tasks: ['copy']
			// },
			// js: {
			// 	files: ['<%= config.app %>/scripts/{,**/}*.js'],
			// 	tasks: ['copy']
			// },
			scss: {
				files: ['<%= config.app %>/styles/scss/{,**/}*.scss'],
					tasks: ['compass:dev']
				}
		},

		ngAnnotate: {
			dist: {
				src: '<%= config.tmp %>/scripts/app.js'
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
			},
			tmp: {
				files: {
					src: '.tmp'
				}
			}
		},

		concat: {
			dist: {
				src: '<%= config.app %>/scripts/{,**/}*.js',
				dest: '<%= config.tmp %>/scripts/app.js'
			}
		},

		uglify: {
			dist: {
				src: '<%= config.tmp %>/scripts/app.js',
				dest: '<%= config.dist %>/scripts/app.min.js'
			}
		},

		compass: {
			dev: {
				options: {
					sassDir: '<%= config.app %>/styles/scss',
					cssDir: '<%= config.app %>/styles/css',
					imagesDir: '<%= config.app %>/images',
					javascriptsDir: '<%= config.app %>/scripts',
					outputStyle: 'expanded'
				}
			},
			dist: {
				options: {
					environment: 'production',
					outputStyle: 'compress',
					sassDir: '<%= config.app %>/styles/scss',
					cssDir: '<%= config.dist %>/styles/css',
					imagesDir: '<%= config.dist %>/images',
					javascriptsDir: '<%= config.dist %>/scripts',
					
				}
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
						'**/*.{ico,png,txt,webp,gif,png,jpeg,jpg,html,css}',
						'scripts/vendor/*.js'
					]
				}]
			}
		},

		useminPrepare: {
			html: 'index.html',
		},

		usemin: {
			html: '<%= config.dist %>/index.html'
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
		'compass:dev',
		'watch'
	]);

	grunt.registerTask('prod', [
		'clean:dist',
		'compass:dist',
		'copy:dist',
		'useminPrepare',
		'concat',
		'ngAnnotate',
		'uglify',
		'usemin',
		'clean:tmp'
	]);

	grunt.registerTask('default', [
		'prod'
	]);

	grunt.registerTask('heroku', [
		'prod'
	]);
};
