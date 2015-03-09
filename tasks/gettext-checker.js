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
            potFile: 'i18n/template.pot',
            poFile: 'i18n/en-gb.po'
        };
        var options = this.options(defaultOptions);

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
        };

        // get pot file keys as array
        var potKeys = getPoKeys(potFile.items);
        var poKeys = getPoKeys(poFile.items);

        grunt.log.writeln('Checking files: ' + options.potFile + '->' + options.poFile);

        var keyDiff;

        if (options.checkPoKeys) {
            // find items in template.pot that are not in this po file
            keyDiff = _.difference(potKeys, poKeys);
            if (keyDiff.length > 0 ) {
                grunt.log.error('The following translation keys in ' + options.potFile + ' are not present in ' + options.poFile);
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
                grunt.log.error('The following translation keys in ' + options.poFile + ' are not present in ' + options.potFile);
                grunt.log.error(keyDiff);
                grunt.fail.fatal('Check FAILED.');
            } else {
                grunt.log.ok('All keys from .po file are present in .pot template.');
            }
        }

        if (options.checkKeyOrder) {
            // Check if keys in .pot file and .po file are in same order. We use _.find to drop out as soon as we find one non-matching
            // to make things a bit faster if we can
            var matchingOrder = _.find(potKeys, function (item, index) {
                if (poKeys[index] !== item) {
                    // The keys don't match, so are out of order
                    return true;
                }
                return false;
            });
            // _.find returns undefined if all keys are in matching order, so we error if it is not undefined
            if (!_.isUndefined(matchingOrder)) {
                grunt.log.error(
                    'The keys in ' + options.potFile + ' and ' + options.poFile + ' are not in the same order.\r\n' +
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
