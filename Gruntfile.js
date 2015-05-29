/*
    * grunt-cli
     * http://gruntjs.com/
      *
       * Copyright (c) 2012 Tyler Kellen, contributors
        * Licensed under the MIT license.
         * https://github.com/gruntjs/grunt-init/blob/master/LICENSE-MIT
         */

         'use strict';

         module.exports = function(grunt) {
            var js_libraries = [
              "src/chunk.js"
            ];

            grunt.initConfig({
                pkg: grunt.file.readJSON('package.json'),
                
                uglify: {
                  options: { mangle: false },
                  my_target: {
                      files: {
                        'build/chunk.min.js': js_libraries
                      }
                  }
                },
                watch: {
                  options: { spawn: false },
                  scripts: {
                       files: js_libraries,
                       tasks: ['uglify']
                  }
               }
           });

grunt.loadNpmTasks('grunt-contrib-watch');
grunt.loadNpmTasks('grunt-contrib-uglify');

grunt.registerTask('default', ['uglify']);
};

