var osenv = require('osenv');
var fs    = require('fs');

global.library = osenv.home() + '/.lamp/books';

// Make sure the library folder exists
if (!fs.existsSync(library)) {
    fs.mkdirSync(library);
}
