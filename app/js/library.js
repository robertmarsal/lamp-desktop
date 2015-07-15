var fs       = require('fs');
var path     = require('path');
var checksum = require('checksum');
var EPub     = require('epub');

var libraryContainer = document.querySelector('#lamp-container');

function getBookCoverSrc(epub, sum, callback) {

    // Check if the cover is cached
    var cachedCover = path.join(global.library, 'cache', sum + '.jpeg');

    if (fs.existsSync(cachedCover)) {
        callback(cachedCover, epub.metadata);
        return;
    }

    // Try to locate the cover
    if (epub.metadata.cover) {

        epub.getImage('cover', function(error, img, mimeType){

            fs.writeFile(
                cachedCover,
                img,
                function () { callback(cachedCover, epub.metadata); }
            );
        });

        return;
    }

    // Use default image @TODO
}

function buildDomBook(coverSrc, epubMetadata) {

    var eBookContainer        = document.createElement('div');
    var eBookLink             = document.createElement('a');
    var eBookOverlay          = document.createElement('div');
    var eBookOverlayContainer = document.createElement('span');
    var eBookTitle            = document.createElement('strong');
    var eBookAuthor           = document.createElement('strong');
    var eBookBy               = document.createTextNode('by');
    var eBookCover            = document.createElement('img');

    eBookContainer.setAttribute('class', 'lamp-book');
    eBookOverlay.setAttribute('class', 'lamp-book-overlay');
    eBookAuthor.setAttribute('class', 'lamp-book-author');
    eBookTitle.setAttribute('class', 'lamp-book-title');

    eBookTitle.innerHTML  = epubMetadata.title;
    eBookAuthor.innerHTML = epubMetadata.creator;

    eBookOverlayContainer.appendChild(eBookTitle);
    eBookOverlayContainer.appendChild(eBookBy);
    eBookOverlayContainer.appendChild(eBookAuthor);

    eBookCover.setAttribute('class', 'lamp-book-cover');
    eBookCover.setAttribute('src', coverSrc);

    eBookOverlay.appendChild(eBookOverlayContainer);

    eBookLink.appendChild(eBookOverlay);
    eBookLink.appendChild(eBookCover);

    eBookContainer.appendChild(eBookLink);
    libraryContainer.appendChild(eBookContainer);
}

function importBook (file, sum) {
    console.log('Importing ' + file);

    var epub = new EPub(path.join(global.library, 'books', file), './',  './');

    epub.on('end', function() {
        getBookCoverSrc(epub, sum, buildDomBook);
    });

    epub.parse();
}

exports.sync = function () {
    console.log('Synchronizing library...');

    // Clear the current library
    libraryContainer.innerHTML = '';

    // Get all books in the library folder
    fs.readdir(path.join(global.library, 'books'), function(err, files) {
        if (err) {
            return;
        }

        files.forEach(function(file){
            // Obtain a checksum of the file that will identify the book
            checksum.file(path.join(global.library, 'books', file), function (err, sum){
                 importBook(file, sum);
            });
        });
    })


    return;
};
