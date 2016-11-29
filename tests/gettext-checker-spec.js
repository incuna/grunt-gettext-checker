var path = require('path');
var execSync = require('child_process').execSync;
var spawnSync = require('child_process').spawnSync;
var execOptions = {
    cwd: path.join(__dirname, '..')
}

var run = function (cmd) {
    try {
        var result = execSync(cmd, execOptions);
    } catch (error) {
        throw new Error(error.stdout);
        // throw(error.stdout.split('\n')[0]);
    } finally {
        expect(true).toBe(true);
    }
    // var errorText = result.error || result.stderr.toString().trim();
    // console.log('result.status', result.status);
    // console.log('run error', result.error);
    // // console.log('run stdout', result.stdout.toString().trim());
    // if (errorText) {
    //     throw new Error(errorText);
    // } else {
    //     return result.stdout.toString().trim();
    // }
};

describe('gettext-checker', function () {

    beforeEach(function () {

    });

    it('should error', function () {
        try {
            run('grunt gettext-checker --no-color');
        } catch (error) {
            console.log(error.message);
            // var message = error.message.replace(/\n/g, ' ');
            // console.log('message', message);
            var poNotInTemplateMessage = '>> The following translation keys in tests/de.po are not present in\n>> tests/template.pot:';
            expect(error.message).not.toMatch(poNotInTemplateMessage, 'Message does not contain: ' + poNotInTemplateMessage);
            var templateNotInPoMessage = '>> The following translation keys in tests/template.pot are not present in\n>> tests/de.po:';
            expect(error.message).not.toMatch(templateNotInPoMessage, 'Message does not contain: ' + templateNotInPoMessage);
            var wrongOrderMessage = '>> The keys in tests/de.po and tests/template.pot are not in the same order';
            expect(error.message).toMatch(wrongOrderMessage, 'Message does not contain: ' + wrongOrderMessage);
        }
    });

});
