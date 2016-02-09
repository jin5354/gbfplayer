const React = require('react');

class GameWebview extends React.Component {
    render() {
        return (
            <webview disablewebsecurity src="http://gbf.game.mbga.jp/"></webview>
        );
    }
}

export default GameWebview;