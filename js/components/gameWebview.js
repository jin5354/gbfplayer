const React = require('react');

class gameWebview extends React.Component {
    render() {
        return (
            <webview disablewebsecurity src="http://gbf.game.mbga.jp/"></webview>
        );
    }
}

export default gameWebview;