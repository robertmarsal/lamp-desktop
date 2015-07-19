var React = require('react');
var Book  = require('./Book');

var BookGrid = React.createClass({
    openBook: function() {
        this.props.openBook();
    },
    render: function() {
        var books = this.props.books.map(function (book) {
            return (
                <Book book={book} key={book.key} openBook={this.props.openBook}/>
            );
        }, this);

        return (
            <div id="lamp-container">
                {books}
            </div>
        );
    }
});

module.exports = BookGrid;
