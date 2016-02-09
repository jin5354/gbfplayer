import React from 'react';
import WebviewCtrlStore from '../stores/WebviewCtrlStore';

class GameWebview extends React.Component {
    componentDidMount() {

        let webview = this.refs.gameWebview;

        WebviewCtrlStore.addChangeListener((event) => {

            switch(event) {
            case 'goBack':
                webview.goBack();
                break;
            case 'reload':
                webview.reload();
                break;
            case 'gotoMypage':
                webview.loadURL('http://gbf.game.mbga.jp/#mypage');
            }

        });
        /*
        this.refs.gameWebview.addEventListener('did-start-loading', () => {
            console.log('GameWebview start loading!');
        });
        */
    }
    render() {
        return (
            <webview ref="gameWebview" disablewebsecurity src="http://gbf.game.mbga.jp/"></webview>
        );
    }
}

export default GameWebview;