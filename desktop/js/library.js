var fs   = require('fs');
var http = require('http');
var EPub = require('epub');

var libraryContainer = document.querySelector('#lamp-container');

function getBookCoverSrc(bookMetadata, callback) {

    var openLibraryCoversApi = 'http://covers.openlibrary.org/b';
    var openLibrarySearchApi = 'http://openlibrary.org/search.json?';

    // First try using the ISBN
    if (bookMetadata.ISBN) {
        callback(openLibraryCoversApi + '/isbn/' + bookMetadata.ISBN + '-M.jpg');
        return;
    }

    // If ISBN fails, search by creator (author) and title
    if (bookMetadata.creator && bookMetadata.title) {
        var title   = bookMetadata.title.replace(/ /g, '+');
        var author  = bookMetadata.creator.replace(/ /g, '+');
        var request = openLibrarySearchApi + 'title=' + title + '&author=' + author;

        http.get(request, function(res){
            var body = '';

            res.on('data', function(chunk) {
                body += chunk;
            });

            res.on('end', function() {
                var response = JSON.parse(body);

                //@TODO check for empty response

                // Use the first response
                var coverId = response.docs[0].cover_i;

                callback(openLibraryCoversApi + '/ID/' + coverId + '-M.jpg');
                return;
            });
        });
    }

    // Use default image
}

function buildDomBook(coverSrc) {

    var eBookContainer = document.createElement('div');
    var eBookCover     = document.createElement('img');

    eBookContainer.setAttribute('class', 'lamp-book');
    eBookCover.setAttribute('class', 'lamp-book-cover');
    eBookCover.setAttribute('src', coverSrc);


    eBookContainer.appendChild(eBookCover);
    libraryContainer.appendChild(eBookContainer);
}

function importBook (file) {
    console.log('Importing ' + file);

    var epub           = new EPub(global.library + '/books/' + file, './',  './');

    epub.on('end', function() {
        getBookCoverSrc(epub.metadata, buildDomBook);
    });

    epub.parse();
}

exports.sync = function () {
    console.log('Synchronizing library...');

    // Clear the current library
    libraryContainer.innerHTML = '';

    // Get all books in the library folder
    fs.readdir(global.library + '/books', function(err, files) {
        if (err) {
            return;
        }

        files.forEach(importBook);
    })


    return;
};
