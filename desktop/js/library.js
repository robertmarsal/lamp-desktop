var fs   = require('fs');
var EPub = require('epub');

var libraryContainer = document.querySelector('#lamp-container');

function importBook (file) {
    console.log('Importing ' + file);

    var eBook            = new EPub(global.library + '/' + file, './',  './');
    var eBookContainer   = document.createElement('div');
    var eBookCover       = document.createElement('img');

    eBook.on('end', function() {
        console.log(eBook.metadata);

        eBookContainer.setAttribute('class', 'lamp-book');
        eBookCover.setAttribute('class', 'lamp-book-cover');
        eBookCover.setAttribute(
            'src',
            'http://covers.openlibrary.org/b/isbn/' + eBook.metadata.ISBN + '-M.jpg'
        );

        eBookContainer.appendChild(eBookCover);
        libraryContainer.appendChild(eBookContainer);
    });
    eBook.parse();
}

exports.sync = function () {
    console.log('Synchronizing library...');

    // Clear the current library
    libraryContainer.innerHTML = '';

    // Get all books in the library folder
    fs.readdir(global.library, function(err, files) {
        if (err) return;

        files.forEach(importBook);
    })


    return;
};
