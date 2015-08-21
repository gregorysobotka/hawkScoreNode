module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      build: {
        src: '',
        dest: ''
      }
    },
    less: {
      development: {
        options: {
          paths: ["assets/css"],
          yuicompress: true
        },
        files: {
          "assets/css/styles.css": ["assets/less/custom.less"]
        }
      },
      production: {
        options: {
          paths: ["assets/css"],
          yuicompress: true
        },
        files: {
          "assets/css/styles.css": ["assets/less/mixins/*.less"]
        }
      }
    },
    cssmin: {
      options: {
        shorthandCompacting: false,
        roundingPrecision: -1
      },
      target: {
        files: {
          'styles.css': ['assets/css/styles.css']
        }
      }
    },
    react: {
      single_file_output: {
        files: {
          'assets/js/app.js': 'assets/js/app.jsx'
        }
      }
    }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-react');

  // Default task(s).
  grunt.registerTask('default', ['less','cssmin']);

};