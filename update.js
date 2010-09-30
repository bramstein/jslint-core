// FIXME: this is still Narwhal specific
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
				value: m[2] === 'true',
				description: m[3]
			});
		}
	});
	return options;
}

var io = require('file'),
	os = require('os'),
	packageDescription = {
		name: "jslint-core",
		author: 'Bram Stein (b.l.stein@gmail.com)',
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
        directories: {
            lib: "./lib"
        },
        main: "./lib/jslint-core",
		homepage: "http://jslint.com/",
		description: "The JavaScript Code Quality Tool",
		keywords: ["JavaScript", "lint", "jslint", "jslint-core", "fulljslint"]
	},
	output, version, options, oldPackage;

os.command('wget -O lib/jslint-core.js http://www.jslint.com/fulljslint.js');

data = io.read('lib/jslint-core.js');

if (!data.match('exports.JSLINT =')) {
    oldPackage = JSON.parse(io.read('package.json'));
    fakeVersion = (oldPackage.version || '1.0.0').split('.');
	edition = getVersion(data);
	options = getOptions(data);
	output = io.open('lib/jslint-core.js', 'w');

    if (oldPackage.edition !== edition) {
        fakeVersion[1] += 1;
    }

	output.writeLine(data);
	output.writeLine('exports.JSLINT = JSLINT;');
	output.writeLine('exports.options = ' + JSON.stringify(options, null, '\t') + ';');
	output.writeLine('exports.edition = \'' + edition + '\';');
    output.writeLine('exports.version = \'' + fakeVersion.join('.') + '\';');
	output.flush();
	output.close();

	// This doesn't meet the CommonJS requirements for version numbers, but we can't
	// just make up a version number for JSLint. Got to use what we have.
	packageDescription.edition = edition;
    packageDescription.version = fakeVersion.join('.');

	output = io.open('package.json', 'w');
	output.writeLine(JSON.stringify(packageDescription, null, '\t'));
	output.flush();
	output.close();
}
