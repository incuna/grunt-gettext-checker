module.exports = function (grunt) {

    'use strict';

    // Use jit-grunt to only load necessary tasks for each invocation of grunt.
    require('jit-grunt')(grunt);

    require('time-grunt')(grunt);

    grunt.initConfig({
        config: {
            lint: [
                'Gruntfile.js',
                'tasks/**/*.'
            ]
        },
        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            all: [
                '<%= config.lint %>'
            ]
        },
        jscs: {
            options: {
                config: '.jscsrc'
            },
            src: '<%= config.lint %>'
        }
    });

    grunt.registerTask('default', 'test');

    grunt.registerTask('test', 'Lint the code.', [
        'jshint',
        'jscs'
    ]);

};
