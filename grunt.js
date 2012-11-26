module.exports = function(grunt) {
    grunt.initConfig({
        lint: {
            files: ['grunt.js', 'jquery.ui.touch-punch.js']
        },
        jshint: {
            options: {
                immed: false,
                latedef: false,
                browser: true,
                eqeqeq: false
            }
        },

        min: {
            dist : {
                src : ["jquery.ui.touch-punch.js"],
                dest : "jquery.ui.touch-punch.min.js"
            }
        }
    });

    grunt.registerTask('default', 'lint min');
};
