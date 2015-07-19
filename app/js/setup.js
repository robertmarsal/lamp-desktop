var osenv = require('osenv');
var path  = require('path');
var fs    = require('fs');
var books = require('./js/library');

global.library = osenv.home() + '/.lamp';

var libraryFolders = [
    // Main library folder
    global.library,
    // All the user books are stored here
    path.join(global.library, 'books'),
    // Cache of the book covers
    path.join(global.library, 'cache')
];

// Make sure all the library folders exist
libraryFolders.forEach(function(folder){
    if (!fs.existsSync(folder)) {
        fs.mkdirSync(folder);
    }
});

// Sync the library
books.sync();
/*
var React    = require('react');
var BookGrid = require('./js/components/BookGrid.js');

var data = [
  {author: "Pete Hunt", title: "This is one title", key: "1"},
  {author: "Jordan Walke", title: "This is another title", key: "2"}
];

React.render(
  React.createElement(BookGrid, {books: data}),
  document.body
);
*/
