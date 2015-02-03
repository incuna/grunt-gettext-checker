# grunt-gettext-checker

Compares the keys in a `.pot` file with those in a `.po` file to see if there are any differences. Any 
differences cause the task to fail. The most common usage for this is automated testing where this
tasks can be used to check the `.po` files are maintained and up to date with the `template.pot` file.

## Getting Started
This plugin requires Grunt `~0.4.2`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install git://github.com/incuna/grunt-gettext-checker.git#0.1 --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-gettext-checker');
```

## The "gettext-checker" task

### Overview
In your project's Gruntfile, add a section named `gettext-checker` to the data object passed into `grunt.initConfig()`.

```js

grunt.initConfig({
    gettext-checker: {
        options: {
            potFile: 'i18n/template.pot'
        },
        en-gb: {
            options: {
                poFile: 'i18n/en-gb.po'
            }
        },
        de-de: {
            options: {
                poFile: 'i18n/de-de.po'
            }
        }
    }
});
```

### Options

#### options.potFile
Type: `String`
Default value: `i18n/template.pot`

The name and path of the `.pot` template file relative to the Gruntfile.

#### options.poFile
Type: `String`
Default value: `i18n/en-gb.po`

The name and path of the `.po` translation file to compare. Relative to the Gruntfile.

### Usage Examples

#### Default Options
These would be the default options as used in a Gruntfile.

```js
grunt.initConfig({
    gettext-checker: {
        options: {
            potFile: 'i18n/template.pot',
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
    * Update `package.json` with version number (use semver)
    * Update `CHANGELOG.md`
    * Tag release with version number
