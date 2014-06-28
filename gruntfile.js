module.exports = function (grunt) {
    grunt.initConfig({
        nunjucks: {
            precompile: {
                baseDir: 'templates/shared/',
                src: 'templates/shared/*',
                dest: 'static/js/templates.js',
                options: {
//                    env: require('./nunjucks-environment'),
                    name: function (filename) {
                        return filename;
//                        return filename.substring(filename.lastIndexOf("/") + 1, filename.lastIndexOf("."));
                    }
                }
            }
        },
        watch: {
            nunjucks: {
                files: 'templates/shared/*',
                tasks: ['nunjucks']
            },
            less: {
                files: "static/less/*",
                tasks: ["less"]
            }
        },
        less: {
            dist: {
                files: {
                    'static/css/style.css': ['static/less/main.less']
                },
                options: {
                    sourceMap: true,
                    sourceMapFilename: 'static/css/style.css.map',
                    sourceMapBasepath: '/',
                    sourceMapRootpath: '/'
                }
            }
        }
    });
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-nunjucks');

    grunt.registerTask('compile', [
        'nunjucks',
        'less',
        'watch'
    ]);

    grunt.registerTask('default', [
        'compile'
    ]);
};
