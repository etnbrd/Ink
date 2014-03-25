var fs = require('fs');
var yaml = require('js-yaml');
var color = require('onecolor');

var te = function(tpl, data) {
    var re = /<<([^>]+)?>>/g;

    while(match = re.exec(tpl)) {
    	// TODO change eval for a vm
   		tpl = tpl.replace(match[0], eval("data." + match[1]))
    }
    return tpl;
}



var context = yaml.safeLoad(fs.readFileSync('Ink.yml', 'utf8'));

for (var c in context.colors) {
	context.colors[c] = color(context.colors[c]);
};

// console.log(context);


function write(path, name) {

	var file = fs.readFileSync(path + '/' + name);

	fs.writeFile(path + '/src/' + name, te('' + file, context), function(err, file) {
		console.log("done !");
	})
}



function build(theme) {
	return function _build(err, file) {
		console.log(">> " + theme)

		var build = yaml.safeLoad(fs.readFileSync(theme + '/build.yml', 'utf8'));

		if (build.template instanceof Array) {
			for (var i = build.template.length - 1; i >= 0; i--) {
				write(theme, build.template[i]);
			};
		} else {
			write(theme, build.template);
		}
	}
}




for (var i = context.themes.length - 1; i >= 0; i--) {

	fs.readFile(context.themes[i] + '/build.yml', build(context.themes[i]));


};



// fs.readFile('Ink.json', function(err, file) {

// 	eval("var context = " + file); // TODO change that, ugly -> use either parse, or vm

// 	fs.readFile('Ink.sublime-theme', function(err, file) {
// 		fs.writeFile('Ink/Ink.sublime-theme',te('' + file, context) ,function(err, file) {
// 			console.log("done !");
// 		})

// 	});
// })