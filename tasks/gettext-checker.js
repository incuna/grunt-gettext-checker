/*
 * grunt-gettext-checker
 *
 *
 * Copyright (c) 2014 Incuna Ltd.
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (grunt) {

    grunt.registerMultiTask('gettext-checker', 'Compares .pot and .po file translation to check for differences', function () {

        // import Nodejs libs
        var _ = require('lodash');
        var poLib = require('pofile');

        // Get task options and merge with defaults
        var options = this.options({
            potFile: 'i18n/template.pot',
            poFile: 'i18n/en-gb.po'
        });

        var checkFileExists = function (path) {
            if (!grunt.file.isFile(path)) {
                grunt.fail.fatal(path + ' does not exist');
            }
        };

        checkFileExists(options.potFile);
        checkFileExists(options.poFile);

        // load .pot file
        var potFileSource = grunt.file.read(options.potFile);
        // load .po file
        var poFileSource = grunt.file.read(options.poFile);

        var potFile = poLib.parse(potFileSource);
        var poFile = poLib.parse(poFileSource);

        var validatePoFile = function (poObject) {
            if (!poObject.headers) {
                grunt.fail.fatal(options.poFile + ' can not be loaded. Check the file is a valid .po file');
            }
        };

        validatePoFile(potFile);
        validatePoFile(poFile);

        var getPoKeys = function (items) {
            return _.map(items, function (item) {
                return item.msgid;
            });
        }

        // get pot file keys as array
        var potKeys = getPoKeys(potFile.items);
        var poKeys = getPoKeys(poFile.items);

        grunt.log.writeln('Checking po file: ' + options.poFile);

        // find items in template.pot that are not in this po file
        var keyDiff = _.difference(potKeys, poKeys);
        if (keyDiff.length > 0 ) {
            grunt.log.error('The following translation keys in template.pot are not present in ' + options.poFile);
            grunt.log.error(keyDiff);
            grunt.fail.fatal('Check FAILED.');
        }

        // find items in this po file which are not in template.pot
        var keyDiff = _.difference(poKeys, potKeys);
        if (keyDiff.length > 0 ) {
            grunt.log.error('The following translation keys in ' + options.poFile + ' are not present in template.pot');
            grunt.log.error(keyDiff);
            grunt.fail.fatal('Check FAILED.');
        }

        grunt.log.ok('Translation .pot template and all .po file keys match.')

    });
};
