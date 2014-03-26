var fs = require('fs');
var yaml = require('js-yaml');
var color = require('onecolor');

var templateEngine = function(tpl, data) {
    var re = /<<([^>]+)?>>/g;

    while(match = re.exec(tpl)) {
    	// TODO change eval for a vm
   		tpl = tpl.replace(match[0], eval("data." + match[1]))
    }
    return tpl;
}

function write(path, src, name) {


	var file = fs.readFileSync(path + '/' + name);
	var content = templateEngine('' + file, context);
	src = src || '';

	fs.writeFileSync(path + '/' + src + '/' + name, content);
}

function less(path, name, dest) {


	var less = require('less');
	var file = '' + fs.readFileSync(path + '/' + name);

	if (!dest) {
		var re = /.less$/;
		dest = name.replace(re.exec(name), ".css");
	}

	var parser = new(less.Parser)({
	  paths: [path + '/'], // Specify search paths for @import directives
	  filename: name // Specify a filename, for better error messages
	});

	parser.parse(file, function (e, tree) {

		if (e) {
			console.error('\x1B[31m>>\x1B[39m ' + e.message);
	  	for (var i = e.extract.length - 1; i >= 0; i--) {
		  	console.error('  \x1B[31m' + e.extract[i] + '\x1B[39m');
	  	};
		} else {
		  var css = tree.toCSS({
		    // Minify CSS output
		    compress: true
		  });

		  fs.writeFileSync(path + '/' + dest, css);
		}
	});
}

function build(theme) {
	return function _build(err, file) {

		console.log('\x1B[1m\x1B[36m>\x1B[35m>\x1B[39m\x1B[22m ' + theme)

		var build = yaml.safeLoad(fs.readFileSync(theme + '/build.yml', 'utf8'));

		// TEMPLATE

		if (build.template instanceof Array) {
			for (var i = build.template.length - 1; i >= 0; i--) {
				write(theme,build.src, build.template[i]);
			};
		} else {
			write(theme,build.src, build.template);
		}

		// LESS
		if (build.less) {
			build.src = build.src || '';

			if (build.less instanceof Array) {
				for (var i = build.less.length - 1; i >= 0; i--) {
					less(theme + '/' + build.src, build.less[i]);
				};
			} else {
				less(theme + '/' + build.src, build.less);
			}
		}
	}
}


// MAIN

var context = yaml.safeLoad(fs.readFileSync('Ink.yml', 'utf8'));

for (var c in context.colors) {
	context.colors[c] = color(context.colors[c]);
};

for (var i = context.themes.length - 1; i >= 0; i--) {
	fs.readFile(context.themes[i] + '/build.yml', build(context.themes[i]));
};