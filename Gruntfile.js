/*jshint node:true */
'use strict';

module.exports = function (grunt) {

	// load all grunt tasks
	require('load-grunt-tasks')(grunt);

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

		sass: {
			dev: {
				options: {
					style: 'expanded'
				},
				files: {
					'<%= config.app %>/styles/css/barcamp.css':'<%= config.app %>/styles/scss/barcamp.scss'
				}
			},
			dist: {
				options: {
					style: 'compress'
				},
				files: {
					'<%= config.app %>/styles/css/barcamp.css':'<%= config.app %>/styles/scss/barcamp.scss'
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
			html: 'index.html'
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
		'sass',
		'watch'
	]);

	grunt.registerTask('prod', [
		'clean:dist',
		'copy:dist',
		'useminPrepare',
		'concat',
		//'ngAnnotate',
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
