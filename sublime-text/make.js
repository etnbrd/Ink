var hb = require('handlebars');
var fs = require('fs');

var te = function(tpl, data) {
    var re = /<<([^>]+)?>>/g;
    while(match = re.exec(tpl)) {
   		tpl = tpl.replace(match[0], data[match[1]])
    }
    return tpl;
}

fs.readFile('Ink.json', function(err, file) {

	eval("var context = " + file); // TODO change that, ugly -> use either parse, or vm

	fs.readFile('Ink.sublime-theme', function(err, file) {
		fs.writeFile('Ink/Ink.sublime-theme',te('' + file, context) ,function(err, file) {
			console.log("done !");
		})

	});
})