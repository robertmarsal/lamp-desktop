var fs       = require('fs');
var http     = require('http');
var checksum = require('checksum');
var EPub     = require('epub');

var libraryContainer = document.querySelector('#lamp-container');

function getBookCoverSrc(epub, sum, callback) {

    var openLibraryCoversApi = 'http://covers.openlibrary.org/b';
    var openLibrarySearchApi = 'http://openlibrary.org/search.json?';

    // Check if the cover is cached
    if (fs.existsSync(global.library + '/cache/' + sum + '.jpeg')) {
        callback(global.library + '/cache/' + sum + '.jpeg', epub.metadata);
        return;
    }

    // First try to use the local cover
    if (epub.metadata.cover) {

        epub.getImage('cover', function(error, img, mimeType){

            fs.writeFile(
                global.library + '/cache/' + sum + '.jpeg',
                img,
                function () { callback(global.library + '/cache/' + sum + '.jpeg', epub.metadata); }
            );
        });

        return;
    }

    // Fallback to using the ISBN and OpenLibrary (@TODO: cache this)
    if (epub.metadata.ISBN) {
        callback(openLibraryCoversApi + '/isbn/' + epub.metadata.ISBN + '-M.jpg', epub.metadata);
        return;
    }

    // If ISBN fails, search by creator (author) and title (@TODO: cache this)
    if (epub.metadata.creator && epub.metadata.title) {
        var title   = epub.metadata.title.replace(/ /g, '+');
        var author  = epub.metadata.creator.replace(/ /g, '+');
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

                callback(openLibraryCoversApi + '/ID/' + coverId + '-M.jpg', epub.metadata);
                return;
            });
        });
    }

    // Use default image
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

    var epub           = new EPub(global.library + '/books/' + file, './',  './');

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
    fs.readdir(global.library + '/books', function(err, files) {
        if (err) {
            return;
        }

        files.forEach(function(file){
            // Obtain a checksum of the file that will identify the book
            checksum.file(global.library + '/books/' + file, function (err, sum){
                 importBook(file, sum);
            });
        });
    })


    return;
};
