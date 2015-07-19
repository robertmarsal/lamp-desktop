var fs          = require('fs');
var path        = require('path');
var checksum    = require('checksum');
var EPub        = require('epub');
var React       = require('react');
var BookLibrary = require('./components/BookLibrary');

var books = [];

function getBookCoverSrc(epub, sum, callback) {

    // Check if the cover is cached
    var cachedCover = path.join(global.library, 'cache', sum + '.jpeg');

    if (fs.existsSync(cachedCover)) {
        callback(cachedCover, epub.metadata, sum);
        return;
    }

    // Try to locate the cover
    if (epub.metadata.cover) {

        epub.getImage('cover', function(error, img, mimeType){

            fs.writeFile(
                cachedCover,
                img,
                function () { callback(cachedCover, epub.metadata, sum); }
            );
        });

        return;
    }

    // Use default image @TODO
}

function renderBook(coverSrc, epubMetadata, sum) {

    books.push({
        title: epubMetadata.title,
        author: epubMetadata.creator,
        cover: coverSrc,
        key: sum
    });

    React.render(
        React.createElement(BookLibrary, {books: books}),
        document.body
    );
}

function importBook (file, sum) {
    var epub = new EPub(path.join(global.library, 'books', file), './',  './');

    epub.on('end', function() {
        getBookCoverSrc(epub, sum, renderBook);
    });

    epub.parse();
}

exports.sync = function () {

    // Get all books in the library folder
    fs.readdir(path.join(global.library, 'books'), function(err, files) {
        if (err) {
            return;
        }

        files.forEach(function(file){
            // Obtain a checksum of the file that will identify the book
            checksum.file(path.join(global.library, 'books', file), function (err, sum) {
                importBook(file, sum);
            });
        });
    })


    return;
};
