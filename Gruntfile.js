module.exports = function (grunt) {

    'use strict';

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
                '<%= config.files.lint %>'
            ]
        },
        jscs: {
            options: {
                config: '.jscsrc'
            },
            src: '<%= config.files.lint %>'
        }
    });

    grunt.registerTask('default', 'test');

    grunt.registerTask('test', 'Lint the code.', [
        'jshint',
        'jscs'
    ]);

};
