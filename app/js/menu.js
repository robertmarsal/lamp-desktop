var remote  = require('remote');
var fs      = require('fs');
var osenv   = require('osenv');
var path    = require('path');
var books   = require('./js/library');

var Menu   = remote.require('menu');
var dialog = remote.require('dialog');

var libraryFilters = [
    {
        name: 'eBooks (epub)',
        extensions: ['epub']
    }
];

function addBookToLibrary() {

    var bookImporter = function (filePath) {
        if (!filePath) {
            return;
        };
        var fileName = path.basename(filePath);

        var readStream  = fs.createReadStream(filePath[0]);
        var writeStream = fs.createWriteStream(global.library + '/books/' + fileName);

        readStream.pipe(writeStream);

        // After the book is copied sync the library
        writeStream.on('close', books.sync);
    }

    dialog.showOpenDialog(
        { filters: libraryFilters, properties: ['openFile'] },
        bookImporter
    );
}

function displayInfo () {

}

menu = Menu.buildFromTemplate([
    {
        label: 'Library',
        submenu: [
            {
                label: 'Add eBook',
                accelerator: 'Ctrl+O',
                click: addBookToLibrary
            }
        ],
    },
    {
        label: 'About',
        submenu: [
            {
                label: 'Info',
                click: displayInfo
            }
        ],
    },
    {
        label: 'Dev',
        submenu: [
            {
                label: 'Reload',
                accelerator: 'Ctrl+R',
                click: function() { remote.getCurrentWindow().reload(); }
            },
            {
                label: 'Toggle DevTools',
                accelerator: 'F12',
                click: function() { remote.getCurrentWindow().toggleDevTools(); }
            },
        ]
    }
]);

Menu.setApplicationMenu(menu);
