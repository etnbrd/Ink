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


function run_cmd(cmd, args, cb, end) {

	args = args || [];
	console.log("  > ", cmd, args.join(' '));

  var child = require('child_process').spawn(cmd, args);

  child.stdout.on('data', function(buffer) {console.log('' + buffer)});
	child.stdout.on('end', end || function() {console.log('done')});
	child.stderr.on('data', function(buffer) {console.error('' + buffer)});
}

function install(src, dest, load) {

	src.unshift('-avzh');
	src.unshift('rsync');
	src.push(dest);

	var buffer = '';

	new run_cmd('sudo', src, // TODO the sudo shit, run sudo rsync, instead of rsync because of privileges in the destination folder : /usr/share ...
		function(buf){
			buffer += '  ' + buf;
		},
		function() {
			console.log('' + buffer);

			console.log("install done");

			var sep = load.indexOf(" ");
			var cmd = load.substring(0, sep);
			var args = load.substring(sep + 1).split(" ");
			new run_cmd(cmd, args, undefined, function() {
				console.log("load done");
			});
		})
}



function build(theme) {
	return function _build(err, file) {

		console.log('\x1B[1m\x1B[36m>\x1B[35m>\x1B[39m\x1B[22m ' + theme)

		var build = yaml.safeLoad(fs.readFileSync(theme + '/build.yml', 'utf8'));

		build.src = build.src || 'src/';

		// TEMPLATE
		if (build.template instanceof Array) {
			for (var i = build.template.length - 1; i >= 0; i--) {
				write(theme,build.src, build.template[i]);
			};
		} else {
			write(theme,build.src, build.template);
		}

		console.log("template done");

		// LESS
		if (build.less) {
			if (build.less instanceof Array) {
				for (var i = build.less.length - 1; i >= 0; i--) {
					less(theme + '/' + build.src, build.less[i]);
				};
			} else {
				less(theme + '/' + build.src, build.less);
			}
		}

		console.log("less done");

		// INSTALL
		if (build.install) {
			if (build.install.src && build.install.dest) {

				var src = [];

				if(build.install.src instanceof Array)
					for (var i = build.install.src.length - 1; i >= 0; i--) {
						src.push(theme + '/' + build.src + '/' + build.install.src[i]);
					}
				else
					src.push(theme + '/' + build.src + '/' + build.install.src);


				install(src, build.install.dest, build.load);

			} else {
				console.error("Install error : src or dest not defined", build.install.src, build.install.dest);
			}
		}
	}
}


// MAIN


var context = yaml.safeLoad(fs.readFileSync('Ink.yml', 'utf8'));

for (var c in context.colors) {
	context.colors[c] = color(context.colors[c]);
};

if (context.themes) for (var i = context.themes.length - 1; i >= 0; i--) {
	fs.readFile(context.themes[i] + '/build.yml', build(context.themes[i]));
};