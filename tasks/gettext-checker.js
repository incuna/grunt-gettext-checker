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
        var defaultOptions = {
            checkPoKeys: true,
            checkPotKeys: true,
            checkKeyOrder: true,
            templateFile: 'i18n/template.pot',
            poFile: 'i18n/en-gb.po'
        };
        var options = this.options(defaultOptions);

        var checkFileExists = function (path) {
            if (!grunt.file.isFile(path)) {
                grunt.fail.fatal(path + ' does not exist');
            }
        };

        checkFileExists(options.templateFile);
        checkFileExists(options.poFile);

        // load .pot file
        var templateFileSource = grunt.file.read(options.templateFile);
        // load .po file
        var poFileSource = grunt.file.read(options.poFile);

        var templateFile = poLib.parse(templateFileSource);
        var poFile = poLib.parse(poFileSource);

        var validatePoFile = function (poObject, filePath) {
            if (!poObject.headers) {
                grunt.fail.fatal(filePath + ' can not be loaded. Check the file is a valid .po file');
            }
        };

        validatePoFile(templateFile, options.templateFile);
        validatePoFile(poFile, options.poFile);

        var getPoKeys = function (items) {
            return _.map(items, function (item) {
                return item.msgid;
            });
        };

        // get pot file keys as array
        var potKeys = getPoKeys(templateFile.items);
        var poKeys = getPoKeys(poFile.items);

        grunt.log.writeln('Checking files: ' + options.templateFile + '->' + options.poFile);

        var keyDiff;

        if (options.checkPoKeys) {
            // find items in template.pot that are not in this po file
            keyDiff = _.difference(potKeys, poKeys);
            if (keyDiff.length > 0 ) {
                grunt.log.errorlns('The following translation keys in ' + options.templateFile + ' are not present in ' + options.poFile);
                grunt.log.error(keyDiff);
                grunt.fail.fatal('Check FAILED.');
            } else {
                grunt.log.ok('All keys from .pot template are present in .po file.');
            }
        }

        if (options.checkPotKeys) {
            // find items in this po file which are not in template.pot
            keyDiff = _.difference(poKeys, potKeys);
            if (keyDiff.length > 0 ) {
                grunt.log.errorlns('The following translation keys in ' + options.poFile + ' are not present in ' + options.templateFile);
                grunt.log.error(keyDiff);
                grunt.fail.fatal('Check FAILED.');
            } else {
                grunt.log.ok('All keys from .po file are present in .pot template.');
            }
        }

        if (options.checkKeyOrder) {
            // Check if keys in .pot file and .po file are in same order. We use _.some to drop out as soon as we find
            //  one non-matching key to make things a bit faster.
            var outOfOrder = _.some(potKeys, function (item, index) {
                if (poKeys[index] !== item) {
                    // The keys don't match, so are out of order
                    return true;
                }
                return false;
            });
            // _.find returns undefined if all keys are in matching order, so we error if it is not undefined
            if (outOfOrder) {
                grunt.log.errorlns(
                    'The keys in ' + options.templateFile + ' and ' + options.poFile + ' are not in the same order.\r\n' +
                    'If you were not expecting the order to change, please check your generating tool version and ' +
                    'environment to check it matches the environment used by the project.\r\n' +
                    'If you have deliberately changed the order of the .pot file, you must update the order of the ' +
                    '.po files as well - e.g. Using a tool such as poEdit\`s "Update from template" option.'
                );
                grunt.fail.fatal('Check FAILED.');
            } else {
                grunt.log.ok('.pot template and .po file keys are in the same order.');
            }
        }

    });
};
