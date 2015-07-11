var Menu = require('remote').require('menu');

function addBookToLibrary() {

}

menu = Menu.buildFromTemplate([
    {
        label: 'Library',
        submenu: [
            {
                label: 'Add book',
                accelerator: 'Ctrl+A',
                click: addBookToLibrary
            }
        ],
    }
]);

Menu.setApplicationMenu(menu);
