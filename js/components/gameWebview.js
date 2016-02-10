import React from 'react';
import WebviewCtrlStore from '../stores/WebviewCtrlStore';

class GameWebview extends React.Component {

    componentDidMount() {

        let webview = this.refs.gameWebview;

        let css = `body {
            -webkit-font-smoothing: antialiased;
        }`;
        
        webview.addEventListener('did-finish-load', () => {
            console.log('finish!');
            webview.insertCSS(css);
        });
        
        WebviewCtrlStore.addEventListener('change', (event) => {
            switch(event) {
            case 'goBack':
                webview.goBack();
                break;
            case 'reload':
                webview.reload();
                break;
            case 'gotoMypage':
                webview.loadURL('http://gbf.game.mbga.jp/#mypage');
                break;
            case 'openDevTools':
                webview.openDevTools();
                break;
            }
        });
                
    }
    render() {
        return (
            <webview ref="gameWebview" disablewebsecurity src="http://gbf.game.mbga.jp/"></webview>
        );
    }
}

export default GameWebview;