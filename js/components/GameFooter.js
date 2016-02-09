const React = require('react');

class GameFooter extends React.Component {
    render() {
        return (
            <div id="footer">
                <span id="footer-back"></span>
                <span id="footer-reload"></span>
                <span id="footer-mypage"></span>
            </div>
        );
    }
}

export default GameFooter;