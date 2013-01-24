module.exports = function(grunt) {

  grunt.initConfig({

    min: {
      dist: {
        src : [
          'jquery.ui.touch-punch.js'
        ],
        dest: 'jquery.ui.touch-punch.min.js'
      }
    }

  });

  // Define tasks
  grunt.registerTask('default', 'min');

};