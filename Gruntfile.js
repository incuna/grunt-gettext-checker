module.exports = function (grunt) {

    'use strict';

    // Use jit-grunt to only load necessary tasks for each invocation of grunt.
    require('jit-grunt')(grunt);

    require('time-grunt')(grunt);

    grunt.loadTasks('./tasks');

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
        },
        'gettext-checker': {
            options: {
                checkPoKeys: true,
                checkPotKeys: true,
                checkKeyOrder: true
            },
            german: {
                files: [
                    {
                        'tests/de.po': 'tests/template.pot'
                    }
                ]
            }
        }
    });

    grunt.registerTask('default', 'test');

    grunt.registerTask('jasmine', 'Run the jasmine specs', function () {
        var jasmine = new (require('jasmine'))();
        jasmine.loadConfig({
            spec_dir: 'tests',
            spec_files: [
                '**/*[sS]pec.js'
            ],
            helpers: [
                'helpers/**/*.js'
            ],
            'stopSpecOnExpectationFailure': false,
            'random': false
        });

        var done = this.async();
        jasmine.onComplete(function (passed) {
            if (passed) {
                grunt.log.ok('All specs have passed');
                // grunt.log.ok();
            } else {
                grunt.log.error('At least one spec has failed');
                // grunt.fatal();
            }
            done(passed);
        });

        jasmine.execute();
    });

    grunt.registerTask('test', 'Lint the code.', [
        'jshint',
        'jscs',
        'gettext-checker'
    ]);

};
