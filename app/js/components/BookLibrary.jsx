var React       = require('react');
var BookGrid    = require('./BookGrid');
var BookContent = require('./BookContent');

var BookLibrary = React.createClass({
    getInitialState: function() {
        return {
            isBookOpened: false
        };
    },
    openBook: function() {
        this.setState({
            isBookOpened: true,
        });
    },
    render: function() {
        if (this.state.isBookOpened) {
            return (<BookContent />);
        } else {
            return (<BookGrid books={this.props.books} openBook={this.openBook}/>);
        }
    }
});

module.exports = BookLibrary;
