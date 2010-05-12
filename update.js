function getVersion(data) {
	var m = data.match(/edition = '(.*)'/);
	if (m && m.length === 2) {
		return m[1];
	}
	return 'unknown';
}

function getOptions(data) {
	var optionsStart = data.indexOf('boolOptions = {', 0),
		optionsEnd = data.indexOf('},', optionsStart),
		optionsData = data.substring(optionsStart, optionsEnd).split('\n'),
		options = [];

	optionsData.forEach(function (option) {
		var m = option.match(/^\s*([A-Za-z_\$0-9]*)\s*:\s*(true|false),?\s*\/\/\s*(.*)\s*$/);
		if (m) {
			options.push({
				name: m[1],
				value: m[2],
				description: m[3]
			});
		}
	});
	return options;
}

var io = require('file'),
	os = require('os'),
	packageDescription = {
		name: "fulljslint",
		maintainers: [{
			name: "Douglas Crockford",
			web: "http://www.crockford.com/"
		},
		{
			name: "Bram Stein",
			web: "http://www.bramstein.com/",
			email: "b.l.stein@gmail.com"
		}],
		licenses: [{
			type: "MIT with \"Good not Evil\" clause.",
			url: "http://www.jslint.com/fulljslint.js"
		}],
		homepage: "http://jslint.com/",
		description: "The JavaScript Code Quality Tool",
		keywords: ["JavaScript", "lint", "jslint"],
		version: "2010-04-06"
	},
	output, version, options;

os.command('wget -O lib/fulljslint.js http://www.jslint.com/fulljslint.js');

data = io.read('lib/fulljslint.js');

if (!data.match('exports.JSLINT =')) {
	version = getVersion(data);
	options = getOptions(data);
	output = io.open('lib/fulljslint.js', 'w');

	output.writeLine(data);
	output.writeLine('exports.JSLINT = JSLINT;');
	output.writeLine('exports.options = ' + JSON.stringify(options, null, '\t') + ';');
	output.writeLine('exports.version = \'' + version + '\';');
	output.flush();

	// This doesn't meet the CommonJS requirements for version numbers, but we can't
	// just make up a version number for JSLint. Got to use what we have.
	packageDescription.version = version;

	output = io.open('package.json', 'w');
	output.writeLine(JSON.stringify(packageDescription, null, '\t'));
	output.flush();
}
