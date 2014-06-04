var fs = require('fs');
var yaml = require('js-yaml');
var color = require('onecolor');
var async = require('async');

const __src = 'src/';

function _template(path, name, cb) {

	function templateEngine(tpl, data) {
	    var re = /<<([^>]+)>>/g;

	    var hex = /#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})/g;
	    var ansi = '$1/$2/$3';

	    while(match = re.exec(tpl)) {
	    	// TODO change eval for a vm
	    	var repl = eval("data." + match[1]);
	    	console.log(match[0], " => ", repl);
	   		tpl = tpl.replace(match[0], repl)
	    }
	    return tpl;
	}

	var file = fs.readFileSync(path + '/' + name);
	var content = templateEngine('' + file, context);

	fs.writeFileSync(path + '/' + __src + name, content);
	cb(null);
}

function _less(path, name, dest, cb) {

	var file = '' + fs.readFileSync(path + '/' + name);

	if (!cb) {
		cb = dest;
		var re = /.less$/;
		dest = name.replace(re.exec(name), ".css");
	}

	var parser = new(require('less').Parser)({
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
		  cb(null, "less done"); // TODO unsync the writeFile.
		}
	});
}


function run_cmd(cmd, args, cb, end) {

	args = args || [];
	console.log("  > ", cmd, args.join(' '));

  var child = require('child_process').spawn(cmd, args);

  child.stdout.on('data', cb || function(buffer) {console.log('' + buffer)});
	child.stdout.on('end', end || function() {console.log('done')});
	child.stderr.on('data', function(buffer) {console.error('' + buffer)});
}

function _install(src, dest, cb) {

	src.unshift('-avzh');
	src.unshift('rsync');
	src.push(dest);

	var buffer = '';

	// console.log(src.join(' '));

	new run_cmd('sudo', src, // TODO the sudo shit, run sudo rsync, instead of rsync because of privileges in the destination folder : /usr/share ...
		function(buf){
			buffer += '  ' + buf;
		},
		function() {
			cb(null, "install done")
		})
}

function sh(src) {
	new run_cmd(src)
}



function build(theme) {

	this.template = function(src, cb) {
		if (src instanceof Array) {
			async.every(src, function(src, cb) {
				_template(theme, src, cb);
			}, function() {
				cb(null, "template done");
			})
		} else {
			_template(theme, src, function() {
				cb(null, "template done");
			});
		}
	}


	this.less = function(src, cb) {
		if (src) {
			if (src instanceof Array) {
				async.every(src, function(src, cb) {
					_less(theme + '/' + __src, src, cb);
				}, cb)
			} else {
				_less(theme + '/' + __src, src, cb);
			}
		}
	}


	this.run = function(src, cb) {
		new run_cmd('./' + theme + '/' + __src + src, [],
			function(buf) {
				// console.log('' + buf);
			},
			function() {
				cb(null, "run done");
			})
	}

	this.install = function(files, cb) {
		if (files) {
			if (files.src && files.dest) {

				var _files = [];

				if(files.src instanceof Array)
					for (var i = files.src.length - 1; i >= 0; i--) {
						_files.push(theme + '/' + __src + files.src[i]);
					}
				else
					_files.push(theme + '/' + __src + files.src);

				new run_cmd("sync", [],
					function(buf) {
						// console.log('' + buf)
					},
					function() {
						_install(_files, files.dest, cb);
					})

			} else {
				console.error("Install error : src or dest not defined", files.src, files.dest);
			}
		}
	}

	this.load = function(load, cb) {
		var sep = load.indexOf(" ");
		var cmd = load.substring(0, sep);
		var args = load.substring(sep + 1).split(" ");
		new run_cmd(cmd, args, function(buf) {
			// console.log('' + buf);
		},
		function() {
			cb(null, "load done");
		});
	}


	return function _build(err, file) {

		var buildCtx = yaml.safeLoad(fs.readFileSync(theme + '/build.yml', 'utf8'));

		var tasks = [];

		function tasksFactory(fn, argument) {
			return function(cb) {
				return fn(argument, cb);
			}
		}

		for(var b in buildCtx) {
			// console.log(b, this[b]);
			tasks.push(tasksFactory(this[b], buildCtx[b]));
		}

		async.series(tasks, function(errors, results) {


			console.log('\x1B[1m\x1B[36m>\x1B[35m>\x1B[39m\x1B[22m ' + theme);

			for( var i in results) { var res = results[i]
				console.log('  \x1B[1m\x1B[32m✓\x1B[39m\x1B[22m ' + res);
			}
		});
	}
}


// MAIN


var context = yaml.safeLoad(fs.readFileSync('Ink.yml', 'utf8'));

for (var c in context.colors) {
	context.colors[c] = color(context.colors[c]);
	context.colors[c].ansi = function() { // TODO put this in the prototype of onecolor
		return this.hex().replace(/#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})/g, '$1/$2/$3');
	}
};

if (context.themes) for (var i = context.themes.length - 1; i >= 0; i--) {
	fs.readFile(context.themes[i] + '/build.yml', build(context.themes[i]));
};