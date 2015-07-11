var osenv = require('osenv');
var fs    = require('fs');

global.library = osenv.home() + '/.lamp';

var libraryFolders = [
    // All the user books are stored here
    'books',
    // Cache of the book covers
    'cache'
];

// Make sure all the library folders exist
libraryFolders.forEach(function(folder){
    if (!fs.existsSync(global.library + '/' + folder)) {
        fs.mkdirSync(global.library + '/' + folder);
    }
});
