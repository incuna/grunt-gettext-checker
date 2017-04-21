### 3.0.1
* Update Grunt peer dependencies

# 3.0.0

* Allow to use mutliple `.po` files
* The test will no longer fail after it encounters the first failing case, it will carry on to check all language files and error in the end
* BREAKING CHANGE: files are no longer defined in `options`, use standard grunt `files` object:
```js
'gettext-checker': {
    all: {
        files: {
            'i18n/template.pot': 'i18n/*.po'
        }
    }
}
```


# 2.0.0
* Tidy up key order code to make easier to read
* Wrap error message line output at 80 chars
* Rename `potFile` option to `templateFile` to avoid confusion with `poFile` option *BREAKING CHANGE*

## 1.1.0
* Add feature to check order of keys match in `.pot` and `.po` files
* Added grunt options for each type of check
* Fixed missing lodash dependency

# 1.0.0
* Initial working release with checks for missing keys

## 0.1.0
* Initial test project.
