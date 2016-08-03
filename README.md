# grunt-gettext-checker

Compares the keys in a `.pot` file with those in a `.po` file to see if there are any differences. Any 
differences cause the task to fail. The most common usage for this is automated testing where this
tasks can be used to check the `.po` files are maintained and up to date with the `template.pot` file.

This packaged was designed to be used with the template files generated by 
[grunt-angular-gettext](https://github.com/rubenv/grunt-angular-gettext), but can be used more generally
for `.po`/`.pot` file checking.

## Getting Started
This plugin requires Grunt

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install git://github.com/incuna/grunt-gettext-checker.git#4.0.0 --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-gettext-checker');
```

## The "gettext-checker" task

### Overview
In your project's Gruntfile, add a section named `gettext-checker` to the data object passed into `grunt.initConfig()`.

In the `files` object, `dest` should be the catalog `.pot` file and `src` should be individual `.po` files to check.


```js

grunt.initConfig({
    'gettext-checker': {
        'gettext-checker': {
            all: {
                files: {
                    'i18n/template.pot': 'i18n/*.po'
                }
            }
        }
    }
});
```

### Options

#### options.templateFile
Type: `String`
Default value: `i18n/template.pot`

The name and path of the `.pot` template file relative to the Gruntfile.

#### options.poFile
Type: `String`
Default value: `i18n/en-gb.po`

The name and path of the `.po` translation file to compare. Relative to the Gruntfile.

#### options.checkPoKeys
Type: `Boolean`
Default value: `true`

Whether to check that all keys from the input `.pot` file are present in the `.po` file

#### options.checkPotKeys
Type: `Boolean`
Default value: `true`

Whether to check that all keys from the `.po` file are present in the template `.pot` file

#### options.checkKeyOrder
Type: `Boolean`
Default value: `true`

Whether to check that the keys in the `.pot` and `.po` files are in the same order

### Usage Examples

#### Default Options
These would be the default options as used in a Gruntfile.

```js
grunt.initConfig({
    gettext-checker: {
        options: {
            checkPoKeys: true,
            checkPotKeys: true,
            checkKeyOrder: true,
            templateFile: 'i18n/template.pot',
            poFile: 'i18n/en-gb.po',
        }
    }
});
```
## Contributing
* Code style is provided by jsHint and JSCS
* Add unit tests for any new or changed functionality. 
* Lint and test your code using [Grunt](http://gruntjs.com/).
* Test using `grunt test`
* To release:
    * Update `CHANGELOG.md`
    * Update `package.json` with version number (use semver)
    * Update install version in this README.md
    * Tag release with version number
