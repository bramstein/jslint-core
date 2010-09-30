var assert = require('assert'),
	jslint = require('../lib/jslint-core.js');

exports.testLint= function () {
	var test = 'var p {';

	jslint.JSLINT(test, {});

	assert.equal(jslint.JSLINT.errors.length !== 0, true, 'JSLint returns error.');
};

exports.testLintOption = function () {
	var test = 'var p {';

	jslint.JSLINT(test, {nolint: true});

	assert.equal(jslint.JSLINT.errors.length, 0, 'JSLint returns no errors.');
};

exports.testLintLocal = function () {
	var test = '/*jslint nolint:true */\nvar p {';

	jslint.JSLINT(test, {});

	assert.equal(jslint.JSLINT.errors.length, 0, 'JSLint returns no errors.');
};

exports.testLintInline = function () {
    // This should normally report undefined z variable.
    var test = 'var a = {};\n/*jslint nolint:true*/\nz++;\n/*jslint nolint:false*/\na[0] = true;';
	jslint.JSLINT(test, {});

	assert.equal(jslint.JSLINT.errors.length, 0, 'JSLint returns no errors.');
};

if (module === require.main) {
	require('test').run(exports);
}

