var React       = require('react');

var Book = React.createClass({
    openBook: function() {
        this.props.openBook();
    },
    render: function() {
        return (
            <div className="lamp-book">
                <a className="lamb-book-action" onClick={this.openBook}>
                    <div className="lamp-book-overlay">
                        <span>
                            <strong className="lamp-book-title">
                                {this.props.book.title}
                            </strong>
                            <div>by</div>
                            <strong className="lamp-book-author">
                                {this.props.book.author}
                            </strong>
                        </span>
                    </div>
                    <img className="lamp-book-cover" src={this.props.book.cover}/>
                </a>
            </div>
        );
    }
});

module.exports = Book;
