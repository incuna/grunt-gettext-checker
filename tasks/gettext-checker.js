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
            checkKeyOrder: true
        };
        var options = this.options(defaultOptions);

        var checkFileExists = function (path) {
            if (!grunt.file.isFile(path)) {
                grunt.fail.fatal(path + ' does not exist');
            }
        };

        var validatePoFile = function (poObject, filePath) {
            if (!poObject.headers) {
                grunt.fail.fatal(filePath + ' can not be loaded. Check the file is a valid .po file');
            }
        };

        var getMessageId = function (item) {
            return item.msgid;
        };

        var getPoKeys = function (items) {
            var keys = {
                used: [],
                obsolete: []
            };
            // Separate used keys from commented keys. Use two filter loops
            // instead of one loop and pushing, because pushing isn't quick.
            var usedItems = items.filter(function (item) {
                return item.obsolete === false;
            });
            var obsoleteItems = items.filter(function (item) {
                return item.obsolete === true;
            });
            // Return just the msgid values.
            keys.used = usedItems.map(getMessageId);
            keys.obsolete = obsoleteItems.map(getMessageId);
            return keys;
        };

        var error = false;

        var checkPoFile = function (poFilePath, templateFile, templateFilePath, potKeys) {
            // load .po file
            checkFileExists(poFilePath);
            var poFileSource = grunt.file.read(poFilePath);
            var poFile = poLib.parse(poFileSource);

            validatePoFile(poFile, poFilePath);

            // get po file keys as array
            var poKeys = getPoKeys(poFile.items);

            grunt.log.writeln('Checking files: ' + templateFilePath + '->' + poFilePath);

            var keyDiff;

            if (options.checkPoKeys) {
                // find items in template.pot that are not in this po file
                keyDiff = _.difference(potKeys.used, poKeys.used);
                if (keyDiff.length > 0 ) {
                    grunt.log.errorlns('The following translation keys in ' + templateFilePath + ' are not present in ' + poFilePath);
                    grunt.log.error(keyDiff);
                    error = true;
                } else {
                    grunt.log.ok('All keys from .pot template are present in .po file.');
                }
            }

            if (options.checkPotKeys) {
                // find items in this po file which are not in template.pot
                keyDiff = _.difference(poKeys.used, potKeys.used);
                if (keyDiff.length > 0 ) {
                    grunt.log.errorlns('The following translation keys in ' + poFilePath + ' are not present in ' + templateFilePath);
                    grunt.log.error(keyDiff);
                    error = true;
                } else {
                    grunt.log.ok('All keys from .po file are present in .pot template.');
                }
            }

            if (options.checkKeyOrder) {
                // Check if keys in .pot file and .po file are in same order. We
                // use _.some to drop out as soon as we find  one non-matching
                // key to make things a bit faster.
                var outOfOrder = _.some(potKeys.used, function (item, index) {
                    if (poKeys.used[index] !== item) {
                        // The keys don't match, so are out of order
                        return true;
                    }
                    return false;
                });
                if (outOfOrder) {
                    grunt.log.errorlns(
                        'The keys in ' + templateFilePath + ' and ' + poFilePath + ' are not in the same order.\r\n' +
                        'If you were not expecting the order to change, please check your generating tool version and ' +
                        'environment to check it matches the environment used by the project.\r\n' +
                        'If you have deliberately changed the order of the .pot file, you must update the order of the ' +
                        '.po files as well - e.g. Using a tool such as poEdit\`s "Update from template" option.'
                    );
                    error = true;
                } else {
                    grunt.log.ok('.pot template and .po file keys are in the same order.');
                }
            }

            grunt.log.writeln();
        };

        // load .pot file
        var templateFilePath = this.files[0].dest;
        checkFileExists(templateFilePath);
        var templateFileSource = grunt.file.read(templateFilePath);

        var templateFile = poLib.parse(templateFileSource);
        validatePoFile(templateFile, templateFilePath);

        // get pot file keys as array
        var potKeys = getPoKeys(templateFile.items);

        var poFiles = this.filesSrc;
        poFiles.forEach(function (poFile) {
            checkPoFile(poFile, templateFile, templateFilePath, potKeys);
        });

        if (error) {
            grunt.fail.fatal('Check FAILED.');
        }

    });
};
