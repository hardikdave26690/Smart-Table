module.exports = function (grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        src: {
            js: ['smart-table-module/js/*.js'],
            html: ['smart-table-module/partials/*.html'],
			css: ['smart-table-module/css/*.css']
        },
        concat: {
            js: {
			  src: ['<%= src.js %>'],
              dest: './<%= pkg.name %>.debug.js'
			},
			css: {
			  src: ['<%= src.css %>'],
			  dest: './<%= pkg.name %>.css'
			}
        },
        "regex-replace": {
            dist: {
                src: ['<%= pkg.name %>.debug.js'],
                actions: [
                    {
                        search: '\{\{',
                        replace: "<%= grunt.option('startSymbol') %>",
                        flags: "g"
                    },
                    {
                        search: '\}\}',
                        replace: "<%= grunt.option('endSymbol') %>",
                        flags: "g"
                    }
                ]
            }
        },
        html2js: {
            options: {
                base: 'smart-table-module',
                module: 'smartTable.templates'
            },
            smartTable: {
                src: [ '<%= src.html %>' ],
                dest: 'smart-table-module/js/Template.js'
            }
        },
        clean: {
            test: ['test_out']
        },
        uglify: {
            main: {
                src: ['<%= pkg.name %>.debug.js'],
                dest: '<%= pkg.name %>.min.js'
            }
        },
        watch: {
            scripts: {
                files: ['smart-table-module/js/*.js', 'example-app/js/*.js'],
                tasks: ['build'],
                options: {
                    interrupt: true
                }
            }
        },
        template: {
            main: {
                files: {
                    'README.md': ['README.tmpl.md']
                },
                options: {
                    data: {
                        name: '<%= pkg.name %>',
                        version: '<%= pkg.version %>'
                    }
                }
            }
        }
    });
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-html2js');
    grunt.loadNpmTasks('grunt-regex-replace');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-template');
    grunt.registerTask('build', function() {
        grunt.task.run('html2js:smartTable');
        grunt.task.run('concat:js');
		grunt.task.run('concat:css');
        if (grunt.option('startSymbol') && grunt.option('endSymbol')) grunt.task.run('regex-replace');
        grunt.task.run('uglify');
        grunt.task.run('template');
    });
    grunt.registerTask('default', 'build');
};